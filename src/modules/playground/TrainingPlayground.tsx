import { kDefaultFileRequirements } from "@/lib/constants";
import {
  CreateTrainingModel,
  Training,
  TrainingModel,
  trainingModelDummy,
} from "@/types/models/training";
import {
  TrainingMember,
  trainingMemberDummy,
} from "@/types/models/trainingMember";
import { Typography } from "@/ui/Typography";
import {
  Badge,
  Box,
  Button,
  Flex,
  Group,
  Paper,
  Stack,
  TextInput,
} from "@mantine/core";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { useAuthStore } from "../auth/stores/authStore";
import {
  createTrainingMember,
  getTrainingMemberByMemberId,
  getTrainingMemberByTrainingId,
  getTrainingMemberCountByTrainingId,
  updateTrainingMember,
} from "../trainings/services/trainingMemberService";
import {
  createTraining,
  createTrainingMaster,
  getAllTrainings,
  getTrainingById,
  updateTraining,
} from "../trainings/services/trainingService";
import { FormMeta } from "@/types/models/inputMeta";
import { getAllOpportunities } from "../trainings/services/opportunityService";

export const TrainingPlayground: React.FC = () => {
  const [trainings, setTrainings] = useState<Training[]>();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");

  const fetchAllOpportunities = async () => {
    setLoading(true);
    try {
      const newTrainings = await getAllOpportunities();
      console.log(newTrainings);
      setTrainings(newTrainings);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const fetchAllTraining = async () => {
    setLoading(true);
    try {
      const newTrainings = await getAllTrainings();
      console.log(newTrainings);
      setTrainings(newTrainings);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const postTraining = async () => {
    setLoading(true);
    try {
      await createTrainingMaster(trainingModelDummy);
      await fetchAllTraining();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const postRealTrainingEvent = async () => {
    setLoading(true);
    const newTrainingModel: TrainingModel = {
      title: "Pelatihan Auditor Termal dan Elektrikal",
      description: descHTML,
      tag: "training",
      dueDate: Timestamp.fromDate(
        new Date(new Date().setDate(new Date().getDate() + 7))
      ),

      thumbnailFileName: "1685336531955-thermal-audit.jpeg",
      attachments: [
        {
          filename: "1685333884982-TOR training.pdf",
          contentType: "application/pdf",
          size: 373131,
          tag: "Curriculum vitae",
        },
        {
          filename: "1685333945055-Tor Sertifikasi.pdf",
          contentType: "application/pdf",
          size: 303618,
          tag: "Curriculum vitae",
        },
      ],
      trainerName: "EnerCoSS & LSP Hake",
      fileRequirements: kDefaultFileRequirements,
    };

    const newTrainingModelBangunan: TrainingModel = {
      ...newTrainingModel,
      title: "Pelatihan Auditor Energi Bangunan Gedung",
      thumbnailFileName: "1684931718872-pexels-photo-305833.jpeg",
    };

    try {
      await Promise.all([
        createTrainingMaster(newTrainingModel),
        createTrainingMaster(newTrainingModelBangunan),
      ]);
      await fetchAllTraining();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const postTrainingWithDefault = async () => {
    setLoading(true);
    try {
      const defaultTraining: CreateTrainingModel = {
        title: "default training " + new Date().getTime(),
        deadline: Timestamp.fromDate(new Date()),
        trainerName: "enercoss",
      };
      const res = await createTraining(defaultTraining);
      setTrainings([res]);
    } catch (e) {
      alert("error");
    }
    setLoading(false);
  };

  const fetchTrainingById = async () => {
    setLoading(true);
    try {
      const res = await getTrainingById(value);
      setTrainings([res]);
      console.log(res);
    } catch (e) {
      alert("error");
    }
    setLoading(false);
  };

  const updateCustomForm = async () => {
    setLoading(true);
    try {
      const newFormMetas: FormMeta[] = [
        {
          inputType: "input",
          label: "Social Media  (Linkedin/Instagram/Twitter/etc)",
          required: true,
          data: [],
        },
        {
          inputType: "select",
          label: "Choose the position you want",
          required: true,
          data: [
            "Marketing and Communication: Social Media",
            "Marketing and Communication: Website",
            "Graphic Design",
            "Media Partnership",
            "Event",
            "Community Development",
            "Knowledge Hub",
            "Training",
            "Legal",
          ],
        },

        {
          inputType: "input",
          label: "Reason for choosing the position",
          required: true,
          data: [],
        },
        {
          inputType: "input",
          label:
            "General EE Question: What do you know about Energy Efficiency?",

          required: true,
          data: [],
        },
      ];
      await updateTraining(value, { formMetas: newFormMetas });
    } catch (e) {
      alert("erro");
    }
    setLoading(false);
  };

  const updateTrainingTitle = (title: string) => async () => {
    setLoading(true);
    try {
      await updateTraining(value, { title });
    } catch (e) {
      alert("erro");
    }
    setLoading(false);
  };

  const updateAllTrainingTag =
    (tag: "training" | "opportunity") => async () => {
      setLoading(true);
      try {
        if (!trainings) throw new Error("no trainings");
        const promises = await Promise.all(
          trainings.map((t) => updateTraining(t.id, { tag }))
        );
        // await fetchAllTraining();
      } catch (e) {
        alert("erro");
      }
      setLoading(false);
    };

  return (
    <>
      <TextInput
        label={"TrainingId"}
        onChange={(e) => setValue(e.target.value)}
      />
      <Group>
        <Button loading={loading} onClick={fetchAllTraining}>
          Get All Training
        </Button>
        <Button loading={loading} onClick={fetchAllOpportunities}>
          Get All Opportunities
        </Button>
        <Button loading={loading} onClick={postTraining}>
          Create Training
        </Button>
        <Button loading={loading} onClick={fetchTrainingById}>
          Get Training By Id
        </Button>
        <Button
          color="green.7"
          loading={loading}
          onClick={postTrainingWithDefault}
        >
          Default training
        </Button>
        <Button
          color="green.7"
          loading={loading}
          onClick={postRealTrainingEvent}
        >
          Real Training
        </Button>
      </Group>
      <Group>
        <Button loading={loading} onClick={updateCustomForm}>
          update add custom form
        </Button>
        <Button loading={loading} onClick={updateTrainingTitle("Ruby Hoshino")}>
          update title to "Ruby Hoshino"
        </Button>
        <Button
          loading={loading}
          color="yellow"
          onClick={updateAllTrainingTag("opportunity")}
        >
          update all training tag to "opportunity"
        </Button>
        <Button
          loading={loading}
          color="yellow"
          onClick={updateAllTrainingTag("training")}
        >
          update all training tag to "training"
        </Button>
      </Group>
      <Stack>
        {trainings &&
          trainings.map((t, index) => (
            <Paper p={"sm"} withBorder key={t.id}>
              <Typography textVariant="title-sm">{t.id}</Typography>
              <Typography textVariant="title-md">{t.title}</Typography>
              <Typography c="cyan" textVariant="title-sm">
                {t.tag ?? "no tag"}
              </Typography>
            </Paper>
          ))}
      </Stack>
    </>
  );
};

export const TrainingMemberPlayground: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [trainingMembers, setTrainingMembers] = useState<TrainingMember[]>();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [tmId, setTmId] = useState("");

  const fetchMyTraining = async () => {
    setLoading(true);
    const memberId = (user && user.id) || "";
    try {
      const res = await getTrainingMemberByMemberId(memberId);
      console.log(res);
      setTrainingMembers(res);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const postTraining = async () => {
    setLoading(true);
    try {
      await createTrainingMember(trainingMemberDummy);
      await fetchMyTraining();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const fetchTrainingMemberByTrainingId = async () => {
    setLoading(true);
    try {
      const res = await getTrainingMemberByTrainingId(value);
      setTrainingMembers(res);
      console.log(res.map((t) => t.name).join(";"));
    } catch (e) {
      alert("error");
    }
    setLoading(false);
  };

  const fetchTMCount = async () => {
    setLoading(true);
    try {
      const res = await getTrainingMemberCountByTrainingId(value);
      alert(`${res} tm in training id`);
    } catch (e) {
      alert("error");
    }
    setLoading(false);
  };

  const updateTMName = (name: string) => async () => {
    setLoading(true);
    try {
      console.log(tmId);
      await updateTrainingMember(tmId, { name });
    } catch (e) {
      alert("error");
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <>
      <TextInput
        label={"training id"}
        onChange={(e) => setValue(e.target.value)}
      />
      <TextInput label={"tm id"} onChange={(e) => setTmId(e.target.value)} />
      <Group>
        <Button loading={loading} onClick={fetchMyTraining}>
          Get My Training Member
        </Button>
        <Button loading={loading} onClick={postTraining}>
          Create Training Member
        </Button>
        <Button loading={loading} onClick={fetchTrainingMemberByTrainingId}>
          Get Training Member By Training Id
        </Button>
        <Button loading={loading} onClick={fetchTMCount}>
          Get TM Count By Training Id
        </Button>
      </Group>
      <Group>
        <Button loading={loading} onClick={updateTMName("Rosetta")}>
          update name to "Rosetta"
        </Button>
        <Button loading={loading} onClick={updateTMName("Ruby Hoshino")}>
          update name to "Ruby Hoshino"
        </Button>
      </Group>
      <Stack>
        {trainingMembers &&
          trainingMembers.map((t, index) => (
            <Paper p={"sm"} withBorder key={t.id}>
              <Flex align={"center"} justify={"space-between"}>
                <Box>
                  <Typography textVariant="title-md">id: {t.id}</Typography>
                  <Typography textVariant="title-md">
                    training id: {t.trainingId}
                  </Typography>
                  <Typography textVariant="title-md">
                    member id{t.memberId}
                  </Typography>
                  <Typography textVariant="body-md">{t.address}</Typography>
                  <Typography textVariant="body-md">{t.name}</Typography>
                </Box>
                <Badge>{t.status}</Badge>
              </Flex>
            </Paper>
          ))}
      </Stack>
    </>
  );
};

const descHTML = `
<p><em>Society of Energy Efficiency Trust Movement</em> (SEETRUM) adalah organisasi yang memiliki visi membangun ekosistem di bidang energi efisiensi guna meningkatkan kepercayaan kepada para stakeholder pada bidang tersebut. Untuk itu, SEETRUM memiliki misi untuk menjembatani dan memfasilitasi semua pemangku kepentingan untuk membangun ekosistem energi efisiensi yang kohesif di Indonesia. </p>
<p>Kami akan melaksanakan Pelatihan Auditor Energi yang bertujuan untuk memberikan pembekalan terhadap para auditor energi agar tercipta tenaga ahli yang mampu melakukan audit energi secara profesional serta memberikan rekomendasi untuk meningkatkan efisiensi energi pada bidang bangunan gedung, termal, dan elektrikal.</p>
<ul>
<li>Waktu pelaksanaan: Rabu, 24 Mei – Kamis, 25 Mei 2023 </li>
<li>Tempat pelaksanaan: Hotel Ibis Tamarin, Jakarta</li>
</ul>
<p>Batas waktu pendaftaran pelatihan ini tertera pada tanggal di atas. Silahkan menghubungi Instagram kami, @seetrum.id jika Anda memiliki pertanyaan seputar pelatihan ini atau Anda mengalami kesulitan dalam mengisi formulir ini.</p>`;
