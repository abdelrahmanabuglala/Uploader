import React, { useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#9ca3af",
  borderStyle: "dashed",
  backgroundColor: "#dee3ea",
  color: "#6f6f6f",
  outline: "none",
  transition: "border .24s ease-in-out",
  width: "100%",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

interface DropzoneProps {
  onAcceptedFiles: (files: File[]) => void;
}

export const Dropzone = ({ onAcceptedFiles }: DropzoneProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    useDropzone();

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  );

  useEffect(() => {
    console.log(acceptedFiles);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    onAcceptedFiles(acceptedFiles);
  }, [acceptedFiles]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    <div {...getRootProps({ style: style as React.CSSProperties })}>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-call */}
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  );
};
