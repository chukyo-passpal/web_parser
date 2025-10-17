export { parseCubicsAsTimetable } from "./parsers/cubics";
export type { CubicsAsTimetableDTO, CubicsAsTimetablePeriodDTO, CubicsAsTimetableSlotDTO } from "./schemas/cubics";

export { parseCubicsPtNews } from "./parsers/albo";
export type { CubicsPtNewsDTO, CubicsPtNewsEntryDTO, CubicsPtNewsTabDTO } from "./schemas/albo";

export { parseManaboTimetable } from "./parsers/manaboTimetable";
export type {
    ManaboTimetableDTO,
    ManaboTimetablePeriodDTO,
    ManaboTimetableSlotDTO,
    ManaboTimetableTermDTO,
    ManaboTimetableViewModeDTO,
} from "./schemas/manaboTimetable";

export { parseManaboNews } from "./parsers/manaboNews";
export type { ManaboNewsDTO, ManaboNewsItemDTO } from "./schemas/manaboNews";

export { parseManaboReceivedMail, parseManaboSentMail, parseManaboMailView, parseManaboMailSend, parseManaboMailMember } from "./parsers/manaboMail";
export type {
    ManaboMailListPageDTO,
    ManaboReceivedMailDTO,
    ManaboReceivedMailItemDTO,
    ManaboSentMailDTO,
    ManaboSentMailItemDTO,
    ManaboMailViewDTO,
    ManaboMailSendDTO,
    ManaboMailMemberDTO,
} from "./schemas/manaboMail";

export {
    parseManaboClassDirectory,
    parseManaboClassContent,
    parseManaboClassNotAttendContent,
    parseManaboClassEntry,
    parseManaboClassNews,
    parseManaboClassSyllabus,
    parseManaboClassQuizResult,
} from "./parsers/manaboClass";
export type {
    ManaboClassDirectoryDTO,
    ManaboClassDirectoryItemDTO,
    ManaboClassContentDTO,
    ManaboClassContentItemDTO,
    ManaboClassContentActionDTO,
    ManaboClassNotAttendContentDTO,
    ManaboClassEntryDTO,
    ManaboClassEntryRowDTO,
    ManaboClassNewsDTO,
    ManaboClassNewsItemDTO,
    ManaboClassSyllabusDTO,
    ManaboClassSyllabusSectionDTO,
    ManaboClassSyllabusLessonPlanDTO,
    ManaboClassQuizResultDTO,
    ManaboClassQuizResultQuestionDTO,
} from "./schemas/manaboClass";

export { parseManaboEntryForm, parseManaboEntryResponse } from "./parsers/manaboEntry";
export type { ManaboEntryFormDTO, ManaboEntryResponseDTO } from "./schemas/manaboEntry";
