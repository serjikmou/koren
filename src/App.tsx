import {
  Box,
  Button,
  Container,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import swal from "sweetalert";

interface Ticket {
  number: number;
  count: number;
}

function App() {
  const [number, setNumber] = useState<string>("");
  const [count, setCount] = useState<string>("");
  const [numbersArray, setNumbersArray] = useState<number[]>([]);
  const [message, setMessage] = useState<string>("");
  const [totalCount, setTotalCount] = useState<number>(0); // متغیر جمع تعداد نفرات
  const listRef = useRef<HTMLDivElement>(null);
  const audio = new Audio("/News-Ting.mp3");
  const audio1 = new Audio("/error.mp3");
  const ok = new Audio("/message_sent.mp3");
  const checkAndAddNumber = (): void => {
    const parsedNumber: number = parseInt(number);

    if (isNaN(parsedNumber)) {
      setMessage("لطفاً یک عدد معتبر وارد کنید!");
      return;
    }

    if (numbersArray.some((item) => item === parsedNumber)) {
      audio1?.play();
      swal("قبلا وارد شده است", "جهت ادامه کلیک کنید", "error");
      setMessage("این عدد و تعداد در آرایه وجود دارد!");
    } else {
      setNumbersArray([...numbersArray, parsedNumber]);
      audio?.play();
      swal("با موفقیت اضافه شد", "جهت ادامه کلیک کنید", "success");
      setMessage("عدد و تعداد با موفقیت به آرایه اضافه شد!");
    }
    setNumber("");
    setCount("");
  };

  const removeTicket = (index: number): void => {
    const updatedArray = [...numbersArray];
    updatedArray.splice(index, 1);
    setNumbersArray(updatedArray);
  };

  useEffect(() => {
    if (numbersArray.length > 0) {
      localStorage.setItem("numbersArray", JSON.stringify(numbersArray));
    }
  }, [numbersArray]);

  useEffect(() => {
    const storedNumbersArray = localStorage.getItem("numbersArray");
    const parsedNumbersArray = storedNumbersArray
      ? JSON.parse(storedNumbersArray)
      : [];
    setNumbersArray(parsedNumbersArray || [{ number: 0, count: 0 }]);
  }, []);
  // محاسبه مجموع تعداد نفرات
  useEffect(() => {
    // اسکرول به پایین لیست
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [numbersArray]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      checkAndAddNumber();
    }
  };
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        width={1}
        flexDirection={"column"}
        height={"100vh"}
        justifyContent={"space-around"}
      >
        <Box
          display={"flex"}
          justifyContent={"center"}
          flexDirection={"column"}
          alignItems={"center"}
        >
          <Typography sx={{ fontSize: "20px", mb: 1, fontFamily: "Trafik" }}>
            برنامه نویس سیدسجاد موسوی
          </Typography>
          <Box width={"200px"} height={"200px"}>
            <QrScanner
              onDecode={(result) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                setNumber(result), ok.play();
              }}
              onError={(error) => console.log(error?.message)}
            />
          </Box>
        </Box>

        <Box display={"flex"} flexDirection={"column"} mt={5}>
          <Typography
            sx={{
              fontSize: "20px",
              mb: 1,
              fontFamily: "Trafik",
              textAlign: "center",
            }}
          >
            سامانه بلیط کرن بند
          </Typography>
          <TextField
            id="outlined-basic"
            label="بارکد"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            variant="outlined"
            autoComplete="off"
            sx={{ mb: 1, fontFamily: "Trafik" }}
          />
          <Button
            sx={{ mt: 1, fontFamily: "Trafik" }}
            variant="contained"
            onClick={checkAndAddNumber}
          >
            استعلام
          </Button>
          <Typography sx={{ mb: 1, fontFamily: "Trafik", textAlign: "center" }}>
            مجموع تعداد بلیط ها: {numbersArray.length}
          </Typography>{" "}
        </Box>
        <Box mt={4} sx={{ overflowY: "auto" }} ref={listRef}>
          {numbersArray.length !== 0 && (
            <Box overflow={"auto"}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  borderBottom: "1px solid black",
                }}
              >
                <Box sx={{ fontFamily: "Trafik" }}>بارکد</Box>
                <Box sx={{ fontFamily: "Trafik" }}>عملیات</Box>
              </Box>
              {numbersArray.map((item: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                    borderBottom: "1px solid black",
                  }}
                >
                  <Box style={{ fontFamily: "Trafik" }}>{item}</Box>
                  <Button
                    variant="contained"
                    onClick={() => removeTicket(index)}
                    sx={{ fontFamily: "Trafik", mb: 1 }}
                  >
                    حذف
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default App;
