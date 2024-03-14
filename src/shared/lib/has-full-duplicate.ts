import { Grade } from '../enums/grade';

type DuplicateGrade = {
  grade: Grade;
};
export const hasFullDuplicate = (duplicates: DuplicateGrade[]) => {
  return duplicates.some((duplicate) => duplicate.grade === Grade.FULL);
};
