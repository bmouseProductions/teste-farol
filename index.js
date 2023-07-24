const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: "uploads/",
  key: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

async function enviarEmailBackend(
  nome,
  email,
  telefone,
  mensagem,
  propostaFile,
  propostaName
) {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false,
      auth: {
        user: "site@patense.com.br",
        pass: "p!t@n#e0623",
      },
    });

    let info = await transporter.sendMail({
      from: "site@patense.com.br",
      to: ["jhonisilva545@gmail.com"],
      subject:
        "Gostaria de saber mais informações sobre as farinhas de Camarão e Atum",
      html: `<p>Nome: ${nome}</p>
             <p>Telefone: ${telefone}</p>
             <p>E-mail: ${email}</p>
             <p>Mensagem: ${mensagem}</p>`,
      attachments: [
        {
          filename: propostaFile.originalname, // Usamos o nome original com a extensão
          path: propostaFile.path, // Usamos o caminho físico do arquivo no servidor
        },
      ],
    });

    console.log("E-mail enviado: %s", info.messageId);
  } catch (err) {
    console.error(err);
  }
}

app.post("/send", upload.single("propostaFile"), async (req, res) => {
  console.log("Arquivo recebido:", req.file);
  const { nome, email, telefone, mensagem, propostaName } = req.body;
  const propostaFile = req.file;

  try {
    await enviarEmailBackend(
      nome,
      email,
      telefone,
      mensagem,
      propostaFile,
      propostaName
    );

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ msg: "E-mail enviado com sucesso" });
  } catch (error) {
    console.error("Erro ao enviar o e-mail", error);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(500).json({ error: "Erro ao enviar o e-mail" });
  }
});

app.listen(3001, function () {
  console.log("Servidor rodando na porta 3001");
});
