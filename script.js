/**
 * ============================================================
 *  ENVIO AUTOMÁTICO — Ecokraft Design
 * ============================================================
 *  Usa FormSubmit API → leliochemane35kd@gmail.com
 *
 *  IMPORTANTE:
 *  1) NÃO abra o index.html com duplo clique.
 *     Use o ficheiro "abrir-formulario.bat" (liga um servidor local).
 *  2) Na 1.ª vez, abra o Gmail e clique em "Activate Form"
 *     no email do FormSubmit (veja também Spam / Lixo).
 * ============================================================
 */
const DESTINO = {
  email: "leliochemane35kd@gmail.com",
};

(function () {
  const form = document.getElementById("formulario");
  const thanks = document.getElementById("obrigado");
  const progressBar = document.getElementById("progressBar");
  const progressLabel = document.getElementById("progressLabel");
  const voltar = document.getElementById("voltar");
  const btnEnviar = document.getElementById("btnEnviar");
  const submitError = document.getElementById("submitError");
  const blocks = Array.from(document.querySelectorAll("[data-step]"));
  const TOTAL_PERGUNTAS = 13;

  const LABELS = {
    produto: "1. Produto / serviço",
    produto_outro: "1b. Outro produto",
    origem: "2. Como conheceu",
    origem_outro: "2b. Outra origem",
    atendimento_estrelas: "3. Atendimento (estrelas)",
    atendimento_rapido: "4. Atendimento rápido",
    compreensao: "5. Compreendemos o pedido",
    qualidade_estrelas: "6. Qualidade do produto (estrelas)",
    expectativas: "7. Expectativas",
    gostou: "8. O que mais gostou",
    melhorar: "9. O que melhorar",
    voltaria: "10. Voltaria a comprar",
    recomendacao: "11. Recomendação (0-10)",
    depoimento: "12. Depoimento",
    autorizacao: "13. Autoriza uso nas redes",
    nome: "Nome",
  };

  const VALORES = {
    "cartao-visita": "Cartão de visita",
    caneca: "Caneca personalizada",
    agenda: "Agenda personalizada",
    impressao: "Impressão",
    dtf: "DTF",
    outro: "Outro",
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
    whatsapp: "WhatsApp",
    indicacao: "Indicação",
    sim: "Sim",
    "mais-ou-menos": "Mais ou menos",
    nao: "Não",
    parcialmente: "Parcialmente",
    superou: "Superou",
    "com-certeza": "Com certeza",
    talvez: "Talvez",
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  blocks.forEach((block) => observer.observe(block));

  function toggleOutro(name, fieldId) {
    const selected = form.querySelector(`input[name="${name}"]:checked`);
    const field = document.getElementById(fieldId);
    if (!field) return;
    const show = selected && selected.value === "outro";
    field.hidden = !show;
    field.required = show;
    if (!show) field.value = "";
  }

  form.querySelectorAll('input[name="produto"]').forEach((el) => {
    el.addEventListener("change", () => toggleOutro("produto", "produtoOutro"));
  });
  form.querySelectorAll('input[name="origem"]').forEach((el) => {
    el.addEventListener("change", () => toggleOutro("origem", "origemOutro"));
  });

  function paintStars(groupName) {
    const checked = form.querySelector(`input[name="${groupName}"]:checked`);
    const value = checked ? Number(checked.value) : 0;
    form.querySelectorAll(`input[name="${groupName}"]`).forEach((input) => {
      input.nextElementSibling.classList.toggle("on", Number(input.value) <= value);
    });
  }

  ["atendimento_estrelas", "qualidade_estrelas"].forEach((name) => {
    form.querySelectorAll(`input[name="${name}"]`).forEach((input) => {
      input.addEventListener("change", () => paintStars(name));
      input.addEventListener("mouseenter", () => {
        const hoverVal = Number(input.value);
        form.querySelectorAll(`input[name="${name}"]`).forEach((el) => {
          el.nextElementSibling.classList.toggle("hover", Number(el.value) <= hoverVal);
        });
      });
      input.closest("label").addEventListener("mouseleave", () => {
        form.querySelectorAll(`input[name="${name}"]`).forEach((el) => {
          el.nextElementSibling.classList.remove("hover");
        });
      });
    });
  });

  function countAnswered() {
    let answered = 0;
    [
      "produto",
      "origem",
      "atendimento_estrelas",
      "atendimento_rapido",
      "compreensao",
      "qualidade_estrelas",
      "expectativas",
      "gostou",
      "melhorar",
      "voltaria",
      "recomendacao",
      "depoimento",
      "autorizacao",
    ].forEach((name) => {
      const radio = form.querySelector(`input[name="${name}"]:checked`);
      const text = form.querySelector(`[name="${name}"]`);
      if (radio) {
        answered += 1;
        return;
      }
      if (text && text.type !== "radio" && text.value && text.value.trim() !== "") {
        answered += 1;
      }
    });

    return { answered, total: TOTAL_PERGUNTAS };
  }

  function updateProgress() {
    const { answered, total } = countAnswered();
    const pct = Math.round((answered / total) * 100);
    progressBar.style.width = pct + "%";
    progressLabel.textContent = pct + "% concluído";
  }

  form.addEventListener("change", updateProgress);
  form.addEventListener("input", updateProgress);

  function traduzir(valor) {
    return VALORES[valor] || valor;
  }

  function recolherRespostas() {
    const data = new FormData(form);
    const payload = {};
    for (const [key, value] of data.entries()) {
      payload[key] = value;
    }
    return payload;
  }

  function formatarParaEmail(payload) {
    const body = {
      name: payload.nome || "Cliente Ecokraft",
      email: DESTINO.email,
    };

    Object.keys(LABELS).forEach((key) => {
      let raw = payload[key];
      if (raw === undefined || raw === "") {
        if (key === "nome") body[LABELS[key]] = "(não indicado)";
        return;
      }
      if (key === "atendimento_estrelas" || key === "qualidade_estrelas") {
        raw = `${raw}/5 estrelas`;
      } else if (key === "recomendacao") {
        raw = `${raw}/10`;
      } else {
        raw = traduzir(raw);
      }
      body[LABELS[key]] = raw;
    });

    return body;
  }

  async function enviarEmail(payload) {
    if (location.protocol === "file:") {
      throw new Error("SEND_BLOCKED_FILE");
    }

    const campos = formatarParaEmail(payload);

    const response = await fetch(`https://formsubmit.co/ajax/${DESTINO.email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: "Feedback Ecokraft Design — nova avaliação",
        _template: "table",
        _captcha: "false",
        ...campos,
      }),
    });

    const result = await response.json().catch(() => ({}));
    const msg = String(result.message || "");

    if (msg.toLowerCase().includes("activation") || msg.toLowerCase().includes("activate")) {
      throw new Error("NEEDS_ACTIVATION");
    }

    if (msg.toLowerCase().includes("web server") || msg.toLowerCase().includes("html files")) {
      throw new Error("SEND_BLOCKED_FILE");
    }

    if (!response.ok || result.success === "false" || result.success === false) {
      throw new Error("SEND_FAILED");
    }

    return result;
  }

  function setLoading(loading) {
    btnEnviar.disabled = loading;
    btnEnviar.textContent = loading ? "A enviar…" : "Enviar feedback";
  }

  function mostrarErro(msg, detalhe) {
    submitError.hidden = false;
    submitError.innerHTML = msg + (detalhe ? `<br><small>${detalhe}</small>` : "");
  }

  function limparErro() {
    submitError.hidden = true;
    submitError.textContent = "";
  }

  function mostrarObrigado() {
    form.hidden = true;
    thanks.hidden = false;
    thanks.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function validarFormulario() {
    toggleOutro("produto", "produtoOutro");
    toggleOutro("origem", "origemOutro");

    document.querySelectorAll(".question-invalid").forEach((el) => {
      el.classList.remove("question-invalid");
    });

    if (!form.checkValidity()) {
      form.reportValidity();
      const firstInvalid = form.querySelector(":invalid");
      if (firstInvalid) {
        const q = firstInvalid.closest(".question");
        if (q) {
          q.classList.add("question-invalid");
          q.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return false;
    }
    return true;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    limparErro();
    if (!validarFormulario()) return;

    const payload = recolherRespostas();
    setLoading(true);

    try {
      await enviarEmail(payload);
      mostrarObrigado();
    } catch (err) {
      console.error(err);
      const code = err.message;
      if (code === "SEND_BLOCKED_FILE") {
        mostrarErro(
          "Não é possível enviar porque o formulário foi aberto diretamente.",
          "Use o ficheiro <b>abrir-formulario.bat</b> para iniciar o servidor local antes de enviar."
        );
      } else if (code === "NEEDS_ACTIVATION") {
        mostrarErro(
          "O serviço de envio ainda não está ativado.",
          "Abra o e-mail em <b>leliochemane35kd@gmail.com</b> e clique em <b>Activate Form</b>. Depois tente novamente."
        );
      } else if (code === "SEND_FAILED") {
        mostrarErro(
          "O envio falhou. Verifique a sua ligação à Internet e tente novamente.",
          "Se o problema persistir, contacte-nos diretamente por WhatsApp."
        );
      } else {
        mostrarErro(
          "Não foi possível enviar agora. Por favor, tente novamente dentro de momentos.",
          "Verifique a sua ligação à Internet."
        );
      }
    } finally {
      setLoading(false);
    }
  });

  voltar.addEventListener("click", () => {
    form.reset();
    form.hidden = false;
    thanks.hidden = true;
    limparErro();
    document.getElementById("produtoOutro").hidden = true;
    document.getElementById("origemOutro").hidden = true;
    paintStars("atendimento_estrelas");
    paintStars("qualidade_estrelas");
    updateProgress();
    document.getElementById("inicio").scrollIntoView({ behavior: "smooth" });
  });

  updateProgress();
})();
