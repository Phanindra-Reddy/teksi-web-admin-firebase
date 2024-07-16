import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FileUpload from "../components/FileUpload";
import { storage } from "../../firebase";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "firebase/storage";
import { notifyError } from "../../toast";
import { useForm } from "react-hook-form";

const defaultTheme = createTheme();

const AddDriver = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const handleFileChange = (e) => {
    setValue("file", e.target.files[0]);
  };


  const fileUploadProp = {
    accept: "image/*",
    onChange: (event) => {
      if (event.target.files !== null && event.target?.files?.length > 0) {
        console.log(`Saving ${event.target.value}`, event.target?.files);

        const imageRef = storageRef(
          storage,
          `drivers/d1/${event.target?.files[0].name}`
        );
        const uploadTask = uploadBytesResumable(
          imageRef,
          event.target?.files[0]
        );

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            // var progress =
            //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log("Upload is " + progress + "% done");
          },
          (error) => {
            // Handle unsuccessful uploads
            console.log(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...

            getDownloadURL(uploadTask.snapshot.ref)
              .then((url) => {
                //saveData(url);
                console.log("uploaded url", url);
              })
              .catch((error) => {
                notifyError(error.message);
              });
          }
        );
      }
    },
    onDrop: (event) => {
      console.log(`Drop ${event.dataTransfer.files[0].name}`);
    },
  };


  return (
    <div>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main">
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              component="h1"
              variant="h5"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              Add New Driver
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        autoComplete="given-name"
                        name="firstName"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="family-name"
                        autoFocus
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        autoComplete="given-mobile"
                        name="mobile"
                        required
                        fullWidth
                        id="mobile"
                        label="Mobile Number"
                        autoFocus
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="aadhar"
                        label="Aadhar"
                        name="Aadhar Number"
                        autoComplete="given-aadhar"
                        autoFocus
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="driving-licence"
                        label="Driving Licence"
                        type="text"
                        id="driving-licence"
                        autoComplete="driving-licence"
                        autoFocus
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FileUpload {...fileUploadProp} />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create Account
              </Button>
            </form>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default AddDriver;
