import { Timestamp } from "firebase/firestore";
import { BaseModel } from ".";
import { FileInfo, fileInfoDummy } from "./fileInfo";
import { FormMeta } from "./inputMeta";

export type Training = BaseModel & TrainingModel;

export type CreateTrainingModel = {
  title: string;
  trainerName: string;
  deadline?: Timestamp;
};

export type TrainingModel = CreateTrainingModel & {
  dueDate: Timestamp;
  tag: "training" | "opportunity";
  description: string;
  thumbnailFileName: string;
  attachments: FileInfo[];
  fileRequirements: FileRequirement[];
  formMetas?: FormMeta[];
};

export type FileRequirement = {
  title: string;
  description: string;
  accepts: string;
  required: boolean;
  maxSize: number;
};

export const fileRequirementDummy: FileRequirement = {
  title: "Curriculum vitae",
  description:
    "Upload your comprehensive CV highlighting your relevant qualifications, experiences, educations, and skills. We can accept only PDF files that are less than 2 MB in size.",
  accepts: "application/pdf",
  required: true,
  maxSize: 2 * 1024 ** 2,
};

export const fileRequirementImageDummy: FileRequirement = {
  title: "Photo",
  description:
    "Upload a professional photo of yourself for identification purposes. We can accept only JPEG or PNG files that are less than 2 MB in size.",
  accepts: "image/png,image/jpeg",
  required: true,
  maxSize: 2 * 1024 ** 2,
};

export const trainingModelDummy: TrainingModel = {
  title: "Electrical Energy System Auditor",
  tag: "training",
  trainerName: "Enertec",
  thumbnailFileName: "1684857025848-hero-ilustration.png",
  description: `
  Society of Energy Efficiency Trust Movement (SEETRUM) sebagai organisasi yang memiliki visi untuk membangun ekosistem di bidang energi efisiensi guna meningkatkan kepercayaan kepada para seluruh stakeholder di bidang energi efisiensi. Untuk itu, SEETRUM memiliki beberapa misi, salah satunya adalah untuk menjembatani dan memfasilitasi semua pemangku kepentingan untuk membangun ekosistem energi efisiensi yang kohesif di Indonesia.

  Kami akan melaksanakan Pelatihan Auditor Energi Termal dan Elektrikal dan Pelatihan Auditor Bangunan Gedung yang akan dilaksanakan pada:
  
  Hari, tanggal: Jumat-Senin, 24-27 Maret 2023 (Training) dan Selasa, 28 Maret 2023 (Sertifikasi)
  Waktu: 09.00 - 16.00
  Lokasi: Hotel Cipta Wahid Hasyim (Jl. K.H. Wahid Hasyim No.53, RT.1/RW.4, Gondangdia, Kec. Menteng, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10350)
  
  Batas waktu pendaftaran pelatihan ini adalah 22 Maret 2023.
  
  Silahkan menghubungi Instagram kami, @seetrum.id jika Anda memiliki pertanyaan seputar pelatihan ini atau Anda mengalami kesulitan dalam mengisi formulir ini.
  
  Terima kasih.`,
  dueDate: Timestamp.now(),
  attachments: [fileInfoDummy],
  fileRequirements: [fileRequirementDummy, fileRequirementImageDummy],
};
