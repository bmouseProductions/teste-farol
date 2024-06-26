const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");
const mysql = require("mysql");

/* app.use(bodyParser.urlencoded({ extended: true })); */
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
  comercialSugestoes: [
    "vendas@patense.com.br",
    "luiz.khoury@patense.com.br",
    "lorena.moura@patense.com.br",
    "carolina.aroeira@patense.com.br",
    "stenio.lopes@farol.ind.br",
    "sbc@bfpbrasil.com.br",
    "mktpatense@gmail.com",
    "guilherme.borges@patense.com.br",
    "sales@patense.com.br",
  ],
  comercialReclamacoes: [
    "vendas@patense.com.br",
    "luiz.khoury@patense.com.br",
    "lorena.moura@patense.com.br",
    "carolina.aroeira@patense.com.br",
    "stenio.lopes@farol.ind.br",
    "sbc@bfpbrasil.com.br",
    "mktpatense@gmail.com",
    "guilherme.borges@patense.com.br",
    "sales@patense.com.br",
  ],
  comercialInformacoes: [
    "vendas@patense.com.br",
    "luiz.khoury@patense.com.br",
    "lorena.moura@patense.com.br",
    "carolina.aroeira@patense.com.br",
    "stenio.lopes@farol.ind.br",
    "sbc@bfpbrasil.com.br",
    "mktpatense@gmail.com",
    "guilherme.borges@patense.com.br",
    "sales@patense.com.br",
  ],
  originacao: ["marcos.mota@patense.com.br", "mktpatense@gmail.com"], //
  administrativos: ["lara.silva@patense.com.br", "mktpatense@gmail.com"], //
  logistica: [
    "logisticami.farinha@patense.com.br",
    "logisticami.oleos@patense.com.br",
    "mktpatense@gmail.com",
  ],
  administrativosRH: ["lara.silva@patense.com.br", "mktpatense@gmail.com"], //
  administrativosCompras: ["fornecedores@farol.ind.br", "mktpatense@gmail.com"], //lara.silva@patense.com.br
  comercialDuvidas: [
    "vendas@patense.com.br",
    "luiz.khoury@patense.com.br",
    "lorena.moura@patense.com.br",
    "carolina.aroeira@patense.com.br",
    "stenio.lopes@farol.ind.br",
    "sbc@bfpbrasil.com.br",
    "mktpatense@gmail.com",
    "guilherme.borges@patense.com.br",
    "sales@patense.com.br",
  ],
};

const sectorDescriptions = {
  comercialSugestoes: "Comercial - Sugestões",
  comercialReclamacoes: "Comercial - Reclamações",
  comercialInformacoes: "Comercial - Informações",
  originacao: "Originação",
  administrativos: "Administrativos",
};

async function enviarEmailBackend(
  nome,
  email,
  telefone,
  mensagem,
  /*   propostaFile,
  propostaName, */
  setor,
  teste,
  country1,
  country2
) {
  try {
    console.log("Valores recebidos na função enviarEmailBackend:", {
      nome,
      email,
      telefone,
      mensagem,
      setor,
      teste,
      country1,
      country2,
    });

    const toEmail = sectorEmails[setor];
    console.log("Valor de setor:", setor);
    console.log("Email para enviar:", toEmail);

    if (!toEmail) {
      throw new Error("E-mail não encontrado para o setor: " + setor);
    }

    /*     if (!toEmail) {
      throw new Error("Invalid sector");
    } */

    const setorDescricao = sectorDescriptions[setor];

    /*     if (!setorDescricao) {
      throw new Error("Setor description not found");
    } */

    let transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false,
      auth: {
        user: "site@patense.com.br",
        pass: "p!t@n#e0623",
      },
    });

    /*     const attachments = [];

    if (propostaFile) {
      // If the file exists, add it to attachments
      attachments.push({
        filename: propostaName,
        path: propostaFile.path,
      });
    } */

    let info = await transporter.sendMail({
      from: "site@patense.com.br",
      to: toEmail, //toEmail
      subject: `Site Farol - Mais informações sobre os produtos`,
      html: `${setorDescricao}
      <p>Nome: ${nome}</p>
             <p>Telefone: ${telefone}</p>
             <p>Opcao selecionada: ${teste}</p>
             <p>E-mail: ${email}</p>
             <p>País de Encontro: ${country1}</p>
             <p>País Destino: ${country2}</p>
             <p>Mensagem: ${mensagem}</p>`,
      //attachments: attachments,
    });

    console.log("E-mail enviado: %s", info.messageId);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

app.post(
  "/send",
  /* upload.single("propostaFile") */ async (req, res) => {
    /* console.log("Arquivo recebido:", req.file); */
    const {
      nome,
      email,
      telefone,
      mensagem,
      /* propostaName */ setor,
      teste,
      country1,
      country2,
    } = req.body;
    /*   const propostaFile = req.file; // File attached via Multer */
    console.log("Setor recebido no servidor:", setor);
    try {
      await enviarEmailBackend(
        nome,
        email,
        telefone,
        mensagem,
        /*       propostaFile,
      propostaName, */
        setor,
        teste,
        country1,
        country2
      );

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(200).json({ msg: "E-mail enviado com sucesso" });
    } catch (error) {
      console.error("Erro ao enviar o e-mail", error);
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(500).json({ error: "Erro ao enviar o e-mail" });
    }
  }
);

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
