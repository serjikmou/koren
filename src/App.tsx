import { Box, Button, Input, TextField, Typography } from "@mui/material";
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
  const [numbersArray, setNumbersArray] = useState<Ticket[]>([]);
  const [message, setMessage] = useState<string>("");
  const [totalCount, setTotalCount] = useState<number>(0); // متغیر جمع تعداد نفرات
  const listRef = useRef<HTMLDivElement>(null);
  const audio = new Audio("/News-Ting.mp3");
  const audio1 = new Audio("/error.mp3");
  const checkAndAddNumber = (): void => {
    const parsedNumber: number = parseInt(number);
    const parsedCount: number = parseInt(count);

    if (isNaN(parsedNumber) || isNaN(parsedCount)) {
      setMessage("لطفاً یک عدد معتبر وارد کنید!");
      return;
    }

    if (numbersArray.some((item: Ticket) => item.number === parsedNumber)) {
      audio1?.play();
      swal("قبلا وارد شده است", "جهت ادامه کلیک کنید", "error");
      setMessage("این عدد و تعداد در آرایه وجود دارد!");
    } else {
      setNumbersArray([
        ...numbersArray,
        { number: parsedNumber, count: parsedCount },
      ]);
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
    const sum = numbersArray.reduce((total, item) => total + item.count, 0);
    setTotalCount(sum);

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
    <Box
      display="flex"
      width={1}
      height={"100vh"}
      justifyContent={"space-around"}
    >
      <Box
        mt={4}
        width={3 / 4}
        maxHeight={"700px"}
        sx={{ overflowY: "auto" }}
        ref={listRef}
      >
        {numbersArray.length !== 0 && (
          <div style={{ width: "50%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                marginBottom: "8px",
                borderBottom: "1px solid black",
              }}
            >
              <div style={{ fontFamily: "Trafik" }}>بارکد</div>
              <div style={{ fontFamily: "Trafik" }}>تعداد نفرات</div>
              <div style={{ fontFamily: "Trafik" }}>عملیات</div>
            </div>
            {numbersArray.map((item: Ticket, index: number) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                  borderBottom: "1px solid black",
                }}
              >
                <div style={{ fontFamily: "Trafik" }}>{item.number}</div>
                <div style={{ fontFamily: "Trafik" }}>{item.count}</div>
                <Button
                  variant="contained"
                  onClick={() => removeTicket(index)}
                  sx={{ fontFamily: "Trafik", mb: 1 }}
                >
                  حذف
                </Button>
              </div>
            ))}
          </div>
        )}
      </Box>
      <Box display={"flex"} flexDirection={"column"} ml={5} mt={5}>
        <Typography sx={{ fontSize: "20px", mb: 1, fontFamily: "Trafik" }}>
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
        <TextField
          id="outlined-basic"
          label="تعداد نفر"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          variant="outlined"
          autoComplete="off"
          sx={{ fontFamily: "Trafik" }}
          onKeyDown={handleKeyDown}
        />
        <Button
          sx={{ mt: 1, fontFamily: "Trafik" }}
          variant="contained"
          onClick={checkAndAddNumber}
        >
          استعلام
        </Button>
        <Typography sx={{ mb: 1, fontFamily: "Trafik" }}>
          مجموع تعداد نفرات: {totalCount}
        </Typography>{" "}
        <Typography sx={{ mb: 1, fontFamily: "Trafik" }}>
          مجموع تعداد بلیط ها: {numbersArray.length}
        </Typography>{" "}
      </Box>
      <Box width={"400px"} height={"500px"}>
        <QrScanner
          onDecode={(result) => setNumber(result)}
          onError={(error) => console.log(error?.message)}
        />{" "}
      </Box>
    </Box>
  );
}

export default App;
