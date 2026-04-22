import React, { useState, useEffect, useRef } from "react";
import useApi from "./useApi"; // adjust path if needed

//Helper function
const levels = [
  { value: "Basic", color: "text-green-600", bg: "bg-green-50" },
  { value: "Intermediate", color: "text-yellow-600", bg: "bg-yellow-50" },
  { value: "Advanced", color: "text-red-600", bg: "bg-red-50" },
];

const letterForIndex = (i) => ["A", "B", "C", "D"][i] || "";

//to parse CSV file data
function parseCSVText(csvText) {
  const rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const next = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (current !== "" || row.length > 0) {
        row.push(current);
        rows.push(row);
      }
      current = "";
      row = [];
      if (char === "\r" && csvText[i + 1] === "\n") i++;
      continue;
    }

    current += char;
  }

  if (current !== "" || row.length > 0) {
    row.push(current);
    rows.push(row);
  }

  return rows.map((r) => r.map((c) => c.trim()));
}

const [technology, setTechnology] = useState("");
  const [level, setLevel] = useState("Basic");
  const [timeLimit, setTimeLimit] = useState(30);
  const [questions, setQuestions] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const fileInputRef = useRef(null);

  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalLoggedIn: 0,
    loggedInPercentage: 0,
  });
  const { request } = useApi();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await request("/admin/stats");
        console.log("ADMIN STATS:", data);
        setAdminStats({
          totalUsers: data.totalUsers || 0,
          totalLoggedIn: data.loggedInUsers || 0,
          loggedInPercentage: data.loggedInPercentage || 0,
        });
      } catch (err) {
        console.log("Stats error:", err);
      }
    };

    loadStats();
  }, []);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const validateForm = () => {
    const errors = {};

    if (!technology.trim()) {
      errors.technology = "Technology name is required";
    }

    if (!level) {
      errors.level = "Level is required";
    }

    if (!timeLimit || timeLimit < 1) {
      errors.timeLimit = "Time limit must be at least 1 minute";
    }

    if (questions.length === 0) {
      errors.questions = "Please upload CSV with questions";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      processCSVFile(file);
    } else {
      setToast({
        show: true,
        type: "error",
        message: "Please upload a valid CSV file",
      });
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      processCSVFile(file);
    }
  };

  const processCSVFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      processCSVText(text);
    };
    reader.readAsText(file);
  };

  const processCSVText = (csvText) => {
    if (!csvText) return;

    const rows = parseCSVText(csvText);
    if (rows.length === 0) {
      setToast({
        show: true,
        type: "error",
        message: "Uploaded CSV is empty or invalid",
      });
      return;
    }

    const header = rows[0].map((c) => c.toLowerCase());
    let startIdx = 0;

    const hasQuestionHeader = header.some(
      (h) => h.includes("question") || h.includes("q."),
    );
    const hasAnswerHeader = header.some(
      (h) => h.includes("answer") || h.includes("correct"),
    );
    const hasOptionsHeader = header.some(
      (h) => h.includes("option") || h.includes("choice"),
    );

    if (hasQuestionHeader && (hasAnswerHeader || hasOptionsHeader)) {
      startIdx = 1;
    }

    const parsedQuestions = [];
    for (let i = startIdx; i < rows.length; i++) {
      const row = rows[i];

      if (row.length === 0 || row.every((cell) => !cell.trim())) {
        continue;
      }

      const paddedRow = [...row];
      while (paddedRow.length < 6) {
        paddedRow.push("");
      }

      const question = paddedRow[0] || "";
      const options = [
        paddedRow[1] || "",
        paddedRow[2] || "",
        paddedRow[3] || "",
        paddedRow[4] || "",
      ];
      const answerRaw = (paddedRow[5] || "").trim().toUpperCase();

      let answerKey = "";
      let answerText = "";

      let foundAnswer = false;

      if (["A", "B", "C", "D"].includes(answerRaw)) {
        answerKey = answerRaw;
        const idx = ["A", "B", "C", "D"].indexOf(answerRaw);
        answerText = options[idx] || answerRaw;
        foundAnswer = true;
      }

      if (!foundAnswer && ["1", "2", "3", "4"].includes(answerRaw)) {
        const idx = parseInt(answerRaw) - 1;
        answerKey = ["A", "B", "C", "D"][idx];
        answerText = options[idx] || answerRaw;
        foundAnswer = true;
      }

      if (!foundAnswer) {
        for (let j = 0; j < options.length; j++) {
          if (options[j].trim().toLowerCase() === answerRaw.toLowerCase()) {
            answerKey = ["A", "B", "C", "D"][j];
            answerText = options[j];
            foundAnswer = true;
            break;
          }
        }
      }

      if (!foundAnswer) {
        for (let j = 0; j < options.length; j++) {
          if (
            options[j].trim().toLowerCase().includes(answerRaw.toLowerCase()) ||
            answerRaw.toLowerCase().includes(options[j].trim().toLowerCase())
          ) {
            answerKey = ["A", "B", "C", "D"][j];
            answerText = options[j];
            foundAnswer = true;
            break;
          }
        }
      }

      if (!foundAnswer && options[0]) {
        answerKey = "A";
        answerText = options[0];
      }

      if (question.trim()) {
        parsedQuestions.push({
          question: question.trim(),
          options: options.map((opt) => opt.trim()),
          answerKey,
          answerText,
        });
      }
    }

    if (parsedQuestions.length === 0) {
      setToast({
        show: true,
        type: "error",
        message: "No valid questions found in CSV",
      });
      return;
    }

    setQuestions(parsedQuestions);
    setShowPreview(true);
    setValidationErrors((prev) => ({ ...prev, questions: "" }));

    setToast({
      show: true,
      type: "success",
      message: `${parsedQuestions.length} questions loaded successfully`,
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setToast({
        show: true,
        type: "error",
        message: "Please fill all required fields",
      });
      return;
    }

    try {
      const payload = {
        technology: technology.trim(),
        level,
        timeLimit: parseInt(timeLimit),
        questions,
        totalQuestions: questions.length,
      };

      await request(
        "/admin/upload-quiz",
        "POST",
        payload,
      );

      setToast({
        show: true,
        type: "success",
        message: `Quiz "${technology}" created successfully`,
      });

      resetForm();
    } catch (err) {
      console.log("UPLOAD ERROR:", err);

      setToast({
        show: true,
        type: "error",
        message: err.message || "Quiz upload failed",
      });
    }
  };

  const resetForm = () => {
    setTechnology("");
    setLevel("Basic");
    setTimeLimit(30);
    setQuestions([]);
    setShowPreview(false);
    setValidationErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isFormValid =
    technology.trim() && level && timeLimit >= 1 && questions.length > 0;




const Dashboard = () => {
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard