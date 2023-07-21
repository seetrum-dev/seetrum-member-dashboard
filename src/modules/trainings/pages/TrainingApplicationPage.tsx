import { isIDNPhoneNumber } from "@/lib/utils";
import { useAuthStore } from "@/modules/auth/stores/authStore";
import { FileInfo } from "@/types/models/fileInfo";
import { Training } from "@/types/models/training";
import { TrainingMemberModel } from "@/types/models/trainingMember";
import { IconArrowLeft, IconArrowRight } from "@/ui/Icons";
import { showErrorNotif } from "@/ui/notifications";
import { Button, Center, Container, Flex, Footer, Loader } from "@mantine/core";
import { isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { createTrainingMember } from "../services/trainingMemberService";
import { useTrainingMember } from "../store/useTrainingMember";
import { ApplicationForm } from "../components/ApplicationForm";

const fIDummy: FileInfo = {
  tag: "dummy",
  contentType: "",
  filename: "",
  size: 0,
};

export const TrainingApplicationPage: React.FC = () => {
  const [step, setStep, training, MAX_STEP] =
    useOutletContext<
      [number, React.Dispatch<React.SetStateAction<number>>, Training, number]
    >();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const loadingUser = useAuthStore((state) => state.loading);
  const { addTrainingMember, getTrainingMemberByMemberId } =
    useTrainingMember();
  const [loading, setLoading] = useState(false);

  const form = useForm<TrainingMemberModel>({
    initialValues: {
      memberId: "",
      name: "",
      email: "",
      phoneNumber: "",
      age: 0,
      institutionName: "",
      status: "applied",
      address: "",
      employmentStatus: "",
      gender: "",
      province: "",
      postalCode: "",
      trainingId: "",
      issuedCertificate: [],
      requiredFiles: [],
    },
    validate: (applicant) => {
      if (step === 0) {
        return {
          name: isNotEmpty("Please provide your full name")(applicant.name),
          email: isEmail("Please provide your email")(applicant.email),
          phoneNumber: isIDNPhoneNumber(
            "Please providre your mobile phone number"
          )(applicant.phoneNumber),
          age:
            applicant.age && applicant.age.valueOf() > 0
              ? null
              : "Please provide your age",
          gender: isNotEmpty("Please pick one gender")(applicant.gender),
          employmentStatus: isNotEmpty("Please pick one employment status")(
            applicant.employmentStatus
          ),
          institutionName:
            applicant.employmentStatus === "employed" &&
            isNotEmpty("Please provide your current institution")(
              applicant.institutionName
            ),
          address: isNotEmpty("Please provide your current address")(
            applicant.address
          ),
          province: isNotEmpty("Please provide your current province")(
            applicant.province
          ),
          postalCode: isNotEmpty("Please provide your current postal code")(
            applicant.postalCode
          ),
        };
      }
      if (step === 1 && training.formMetas && training.formMetas.length > 0) {
        return {
          additionalData: applicant.additionalData!.some(
            (d, idx) => training.formMetas![idx].required && !d.value
          ),
        };
      }
      return {
        requiredFiles:
          training.fileRequirements.some(
            (f, index) =>
              f.required && applicant.requiredFiles![index].tag === fIDummy.tag
          ) && "Please provide required files",
      };
    },
  });

  const handleSubmit = form.onSubmit(async (applicant) => {
    setLoading(true);
    try {
      if (applicant.requiredFiles)
        applicant.requiredFiles = applicant.requiredFiles.filter(
          (f) => f.tag !== fIDummy.tag
        );
      if (!form.isValid()) {
        console.error(form.errors);
        throw new Error("Please fill all required fields");
      }
      const newTrainingMember = await createTrainingMember(applicant);
      addTrainingMember(newTrainingMember);
      user && (await getTrainingMemberByMemberId(user.id));
      navigate("/mytrainings");
    } catch (error) {
      console.error(error);

      showErrorNotif({
        title: "Error occurred while applying you in this training.",
      });
    }
    setLoading(false);
  });

  // autofill from user
  useEffect(() => {
    if (user) {
      form.setValues({
        memberId: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.userType === "organization" ? user.address : "",
        province: user.userType === "individual" ? user.address : "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // initialize required files with dummies
  useEffect(() => {
    if (training) {
      form.setValues({
        trainingId: training.id,
        requiredFiles: Array(training.fileRequirements.length).fill(fIDummy),
        additionalData:
          training.formMetas?.map((f) => ({
            label: f.label,
            value: "",
          })) ?? [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [training]);

  if (loadingUser || !user) {
    return (
      <Center h={100}>
        <Loader />;
      </Center>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <ApplicationForm form={form} step={step} training={training} />
      <Footer height={64} p={"sm"}>
        <Container>
          <Flex w="100%" justify="space-between">
            {step > 0 ? (
              <Button
                leftIcon={<IconArrowLeft />}
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setStep((_step) => (_step > 0 ? _step - 1 : 0));
                }}
              >
                Back
              </Button>
            ) : (
              <Flex />
            )}
            <Button
              type="submit"
              loading={loading}
              rightIcon={step < 2 && <IconArrowRight />}
              disabled={!form.isValid()}
              onClick={(e) => {
                if (!form.validate().hasErrors) {
                  if (step < MAX_STEP) {
                    setStep((_step) => (_step < MAX_STEP ? _step + 1 : _step));
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }
              }}
            >
              {step === MAX_STEP ? "Submit application" : "Next"}
            </Button>
          </Flex>
        </Container>
      </Footer>
    </form>
  );
};
