const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");
const mysql = require("mysql");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "vps-5528980.bmouseproductions.com",
  user: "bioseacom_teste",
  password: "Ae@125445364a",
  database: "bioseacom_TesteChat",
});

const storage = multer.diskStorage({
  destination: "uploads/",
  key: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const sectorEmails = {
  comercialMercadoExterno: "sales@patense.com.br",
  comercialMercadoInterno: [
    "marinosio.neto@farol.ind.br",
    "luiz.khoury@patense.com.br",
    "lorena.moura@patense.com.br",
    "carolina.aroeira@patense.com.br",
    "stenio.lopes@farol.ind.br",
    "sbc@bfpbrasil.com.br",
  ],
  comercialMercadoExternoSugestoes: "sales@patense.com.br",
  comercialMercadoInternoSugestoes: [
    "marinosio.neto@farol.ind.br",
    "luiz.khoury@patense.com.br",
    "lorena.moura@patense.com.br",
    "carolina.aroeira@patense.com.br",
    "stenio.lopes@farol.ind.br",
    "sbc@bfpbrasil.com.br",
  ],
  comercialMercadoExternoInformacoes: "sales@patense.com.br",
  comercialMercadoInternoInformacoes: [
    "marinosio.neto@farol.ind.br",
    "luiz.khoury@patense.com.br",
    "lorena.moura@patense.com.br",
    "carolina.aroeira@patense.com.br",
    "stenio.lopes@farol.ind.br",
    "sbc@bfpbrasil.com.br",
  ],
  comercialMercadoExternoReclamacoes: "sales@patense.com.br",
  comercialMercadoInternoReclamacoes: [
    "marinosio.neto@farol.ind.br",
    "luiz.khoury@patense.com.br",
    "lorena.moura@patense.com.br",
    "carolina.aroeira@patense.com.br",
    "stenio.lopes@farol.ind.br",
    "sbc@bfpbrasil.com.br",
  ],
  comercialMercadoExternoDuvidas: "sales@patense.com.br",
  comercialMercadoInternoDuvidas: [
    "marinosio.neto@farol.ind.br",
    "luiz.khoury@patense.com.br",
    "lorena.moura@patense.com.br",
    "carolina.aroeira@patense.com.br",
    "stenio.lopes@farol.ind.br",
    "sbc@bfpbrasil.com.br",
  ],
  originacao: "marcos.mota@patense.com.br",
  administrativos: "lara.silva@patense.com.br",
};

async function enviarEmailBackend(
  nome,
  email,
  telefone,
  mensagem,
  propostaFile,
  propostaName,
  setor
) {
  try {
    const toEmail = sectorEmails[setor]; // Get the email address for the selected sector

    if (!toEmail) {
      throw new Error("Invalid sector");
    }

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
      to: toEmail,
      subject: "Site Farol - Mais informações sobre os produtos",
      html: `<p>Nome: ${nome}</p>
             <p>Telefone: ${telefone}</p>
             <p>E-mail: ${email}</p>
             <p>Mensagem: ${mensagem}</p>`,
      attachments: [
        {
          filename: propostaFile.originalname,
          path: propostaFile.path, // Use the physical file path on the server
        },
      ],
    });

    console.log("E-mail enviado: %s", info.messageId);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

app.post("/send", upload.single("propostaFile"), async (req, res) => {
  console.log("Arquivo recebido:", req.file);
  const { nome, email, telefone, mensagem, propostaName, setor } = req.body;
  const propostaFile = req.file; // File attached via Multer

  try {
    await enviarEmailBackend(
      nome,
      email,
      telefone,
      mensagem,
      propostaFile,
      propostaName,
      setor
    );

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ msg: "E-mail enviado com sucesso" });
  } catch (error) {
    console.error("Erro ao enviar o e-mail", error);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(500).json({ error: "Erro ao enviar o e-mail" });
  }
});

app.post("/track-button-click", (req, res) => {
  const buttonId = req.body.buttonId; // Assuming you send the button ID from the frontend

  console.log("Received button ID:", buttonId);

  // Use the INSERT ... ON DUPLICATE KEY UPDATE query to insert or update the record
  db.query(
    "INSERT INTO rastreio_cliques (nome_botao, quantidade_cliques) VALUES (?, 1) ON DUPLICATE KEY UPDATE quantidade_cliques = quantidade_cliques + 1",
    [buttonId],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.send("Button click recorded successfully.");
    }
  );
});

app.listen(3001, function () {
  console.log("Servidor rodando na porta 3001");
});
