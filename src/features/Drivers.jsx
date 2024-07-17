import { useEffect, useRef, useState } from "react";
import { Box, Button, styled, Typography } from "@mui/material";
import { firestoreDb } from "../../firebase";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { collection, getDocs } from "firebase/firestore";
import AddDriver from "./AddDriver";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const Drivers = () => {
  const descriptionElementRef = useRef(null);

  const [openDriverModal, setOpenDriverModal] = useState(false);
  const [drivers, setDrivers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDrivers = async () => {
    setIsLoading(true);

    try {
      const querySnapshot = await getDocs(
        collection(firestoreDb, "drivers/HYD/HYDDRIVERS")
      );
      const dataList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDrivers(dataList);
    } catch (error) {
      console.log(error, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    if (openDriverModal) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openDriverModal]);

  if (isLoading) {
    return <Typography variant="h5">Loading drivers info...</Typography>;
  }
  return (
    <Box>
      <Button
        onClick={() => setOpenDriverModal(true)}
        sx={{ mb: 5, float: "right" }}
        variant="contained"
      >
        Add Driver
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.No</StyledTableCell>
              <StyledTableCell align="left">Name</StyledTableCell>
              <StyledTableCell align="left">Mobile</StyledTableCell>
              <StyledTableCell align="left">Aadhar</StyledTableCell>
              <StyledTableCell align="left">Email</StyledTableCell>
              <StyledTableCell align="left">Driving License</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers?.map((driver, index) => (
              <TableRow
                key={driver.driverID}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                  {driver?.firstName} {driver?.lastName}
                </TableCell>
                <TableCell align="left">{driver.mobile}</TableCell>
                <TableCell align="left">{driver.aadhar}</TableCell>
                <TableCell align="left">{driver.email}</TableCell>
                <TableCell align="left">{driver.dlNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDriverModal}
        onClose={() => setOpenDriverModal(false)}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title"></DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <AddDriver
              fetchDrivers={fetchDrivers}
              openDriverModal={openDriverModal}
              setOpenDriverModal={setOpenDriverModal}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDriverModal(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Drivers;
