import React, { forwardRef, ReactEventHandler } from "react";
import { FileUploader, FileUploaderAttachedFile, FileUploaderProps, FileUploaderRef } from "@skbkontur/react-ui";

const imageExtensions = new Set(["jpg", "jpeg", "png"]);

interface PhotoUploaderProps extends FileUploaderProps {
    onError?: ReactEventHandler<HTMLInputElement>;
    onChangeFiles: (files: FileUploaderAttachedFile[]) => Promise<void>;
}

export const PhotoUploader = forwardRef<FileUploaderRef, PhotoUploaderProps>(
    ({ onError, onChangeFiles, ...rest }: PhotoUploaderProps, reference) => (
        <FileUploader
            {...rest}
            ref={reference}
            style={{ display: "none" }}
            capture="user"
            accept="image/*"
            multiple
            onError={onError}
            onValueChange={onChangeFiles}
            validateBeforeUpload={({ originalFile }) => {
                const extension = originalFile.type.split("/")[1];
                return imageExtensions.has(extension)
                    ? Promise.resolve(null)
                    : Promise.resolve(`У файла ${originalFile.name} неверный формат`);
            }}
        />
    )
);
