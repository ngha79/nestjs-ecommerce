export interface IUploadImageFromUrl {
  url: string;
  folderName: string;
  fileName?: string;
}

export interface IUploadImageFromLocal {
  folderName?: string;
  fileName?: string;
}
