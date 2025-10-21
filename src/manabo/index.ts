export {
    parseManaboClassDirectory,
    parseManaboClassContent,
    parseManaboClassNotAttendContent,
    parseManaboClassEntry,
    parseManaboClassNews,
    parseManaboClassSyllabus,
    parseManaboClassQuizResult,
} from "./parser/manaboClass";

export { parseManaboEntryForm, parseManaboEntryResponse } from "./parser/manaboEntry";

export { parseManaboReceivedMail, parseManaboSentMail, parseManaboMailView, parseManaboMailSend, parseManaboMailMember } from "./parser/manaboMail";

export { parseManaboNews } from "./parser/manaboNews";

export { parseManaboTimetable } from "./parser/manaboTimetable";

export {
    type ManaboClassDirectoryItemDTO,
    type ManaboClassDirectoryDTO,
    type ManaboClassContentActionDTO,
    type ManaboClassContentItemDTO,
    type ManaboClassContentDTO,
    type ManaboClassNotAttendContentDTO,
    type ManaboClassEntryRowDTO,
    type ManaboClassEntryDTO,
    type ManaboClassNewsItemDTO,
    type ManaboClassNewsDTO,
    type ManaboClassSyllabusEvaluationDTO,
    type ManaboClassSyllabusTextbookDTO,
    type ManaboClassSyllabusReferenceDTO,
    type ManaboClassSyllabusPlanItemDTO,
    type ManaboClassSyllabusDTO,
    type ManaboClassQuizResultQuestionDTO,
    type ManaboClassQuizResultDTO,
} from "./types/manaboClass";

export { type ManaboEntryFormDTO, type ManaboEntryResponseDTO } from "./types/manaboEntry";

export {
    type ManaboMailListPageDTO,
    type ManaboReceivedMailItemDTO,
    type ManaboReceivedMailDTO,
    type ManaboSentMailItemDTO,
    type ManaboSentMailDTO,
    type ManaboMailViewDTO,
    type ManaboMailSendDTO,
    type ManaboMailMemberDTO,
} from "./types/manaboMail";

export { type ManaboNewsItemDTO, type ManaboNewsDTO } from "./types/manaboNews";

export {
    type ManaboTimetableSlotDTO,
    type ManaboTimetablePeriodDTO,
    type ManaboTimetableTermDTO,
    type ManaboTimetableViewModeDTO,
    type ManaboTimetableDTO,
} from "./types/manaboTimetable";
