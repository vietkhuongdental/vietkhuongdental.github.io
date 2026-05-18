import { create } from 'zustand';

export interface FileField {
  file: File | null;
  field?: string;
}

interface FileFieldState {
  chosenUploadingFileFields: FileField[];
  setChosenUploadingFileFields: (files: FileField[]) => void;
  addFileField: (fileField: FileField) => void;
  removeFileField: (field?: string) => void;
  clearFileFields: () => void;
}

export const useFileFieldStore = create<FileFieldState>((set) => ({
  chosenUploadingFileFields: [],
  setChosenUploadingFileFields: (files) =>
    set({ chosenUploadingFileFields: files }),
  addFileField: (fileField) =>
    set((state) => ({
      chosenUploadingFileFields: [...state.chosenUploadingFileFields, fileField]
    })),
  removeFileField: (field) =>
    set((state) => ({
      chosenUploadingFileFields: state.chosenUploadingFileFields.filter(
        (f) => f.field !== field
      )
    })),
  clearFileFields: () => set({ chosenUploadingFileFields: [] })
}));
