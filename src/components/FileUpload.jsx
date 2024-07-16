import { useState } from "react";
import clsx from "clsx";
import { Box, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";

const Root = styled("label")({
  cursor: "pointer",
  textAlign: "center",
  display: "flex",
  "&:hover p, &:hover svg, & img": {
    opacity: 1,
  },
  "& p, svg": {
    opacity: 0.4,
  },
  "&:hover img": {
    opacity: 0.3,
  },
});

const NoMouseEvent = styled(Box)({
  pointerEvents: "none",
});

const IconText = styled(Box)({
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
  position: "absolute",
});

const HiddenInput = styled("input")({
  display: "none",
});

const OnDragOver = styled(Root)({
  "& img": {
    opacity: 0.3,
  },
  "& p, svg": {
    opacity: 1,
  },
});

const FileUpload = ({
  accept,
  imageButton = false,
  hoverLabel = "Click or drag to upload aadhar and driving licence",
  dropLabel = "Drop file here",
  width = "600px",
  height = "100px",
  backgroundColor = "#fff",
  image: {
    url,
    imageStyle = {
      height: "inherit",
    },
  } = {},
  onChange,
  onDrop,
}) => {
  const [imageUrl, setImageUrl] = useState(url);
  const [labelText, setLabelText] = useState(hoverLabel);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const stopDefaults = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };
  const dragEvents = {
    onMouseEnter: () => {
      setIsMouseOver(true);
    },
    onMouseLeave: () => {
      setIsMouseOver(false);
    },
    onDragEnter: (e) => {
      stopDefaults(e);
      setIsDragOver(true);
      setLabelText(dropLabel);
    },
    onDragLeave: (e) => {
      stopDefaults(e);
      setIsDragOver(false);
      setLabelText(hoverLabel);
    },
    onDragOver: stopDefaults,
    onDrop: (e) => {
      stopDefaults(e);
      setLabelText(hoverLabel);
      setIsDragOver(false);
      if (imageButton && e.dataTransfer.files[0]) {
        setImageUrl(URL.createObjectURL(e.dataTransfer.files[0]));
      }
      onDrop(e);
    },
  };

  const handleChange = (event) => {
    if (imageButton && event.target.files[0]) {
      setImageUrl(URL.createObjectURL(event.target.files[0]));
    }

    onChange(event);
  };

  return (
    <>
      <HiddenInput
        onChange={handleChange}
        accept={accept}
        id="file-upload"
        type="file"
      />

      <Root
        htmlFor="file-upload"
        {...dragEvents}
        className={clsx(isDragOver && OnDragOver)}
        style={{border:"1px dotted gray", borderRadius:"5px",overflow:"hidden"}}
      >
        <NoMouseEvent width={width} height={height} bgcolor={backgroundColor}>
          {imageButton && (
            <Box position="absolute" height={height} width={width}>
              <img alt="file upload" src={imageUrl} style={imageStyle} />
            </Box>
          )}

          {(!imageButton || isDragOver || isMouseOver) && (
            <>
              <IconText height={height} width={width}>
                <CloudUploadIcon fontSize="large" />
                <Typography>{labelText}</Typography>
              </IconText>
            </>
          )}
        </NoMouseEvent>
      </Root>
    </>
  );
};

export default FileUpload;
