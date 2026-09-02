Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const b = payload.record ?? {};
    const event = payload.type ?? "INSERT"; // INSERT | spremenjeno | preklicano
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const NOTIFY_EMAIL = Deno.env.get("NOTIFY_EMAIL") ?? "klemen.puhar@gmail.com";
    const TG_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const TG_CHAT = Deno.env.get("TELEGRAM_CHAT_ID");

    const SITE_BASE = (Deno.env.get("SITE_URL") ?? "https://klemenpuhar-star.github.io/studio-najs/").replace(/\/?$/, "/");
    const manageLink = (b.manage_token && b.booking_date)
      ? `${SITE_BASE}narocilo.html?id=${b.manage_token}`
      : null;

    // NUJNI / IZREDNI termin: nima datuma oz. ima status "po dogovoru"
    const jeNujni = (!b.booking_date) || String(b.status ?? "") === "po dogovoru";

    const storitve = b.services_text || b.service_name || "-";
    const cena = (b.total_price != null) ? `${b.total_price} €` : "-";
    const trajanje = (b.total_duration_min != null) ? `${b.total_duration_min} min` : "-";
    const datumSI = b.booking_date ? String(b.booking_date).split("-").reverse().join(".") : null;
    const uraSI = b.start_time ? String(b.start_time).slice(0, 5) : null;
    const telefon = b.customer_phone ?? "-";
    const zelja = b.note ?? "-";

    // ── Naslovi glede na dogodek ─────────────────────────────
    let mailNaslov, mailSubject, tgGlava;
    if (event === "preklicano") {
      mailNaslov = "❌ Termin PREKLICAN (s strani stranke)";
      mailSubject = `PREKLIC termina: ${storitve} (${datumSI ?? "-"})`;
      tgGlava = "❌ Termin PREKLICAN (stranka)";
    } else if (event === "spremenjeno") {
      mailNaslov = "✏️ Termin SPREMENJEN (s strani stranke)";
      mailSubject = `Spremenjen termin: ${storitve} (${datumSI ?? "-"})`;
      tgGlava = "✏️ Termin SPREMENJEN (stranka)";
    } else if (jeNujni) {
      mailNaslov = "🚨 NUJNA ZAHTEVA ZA TERMIN";
      mailSubject = `🚨 NUJNO – stranka potrebuje termin: ${b.customer_name ?? ""} (${telefon})`;
      tgGlava = "🚨🚨🚨 NUJNA ZAHTEVA ZA TERMIN 🚨🚨🚨";
    } else {
      mailNaslov = "🗓️ Nova rezervacija – Najs";
      mailSubject = `Nova rezervacija: ${storitve} (${datumSI ?? ""})`;
      tgGlava = "🗓️ Nova rezervacija – Najs";
    }

    // ── E-posta lastniku ─────────────────────────────────────
    const opozorilo = (jeNujni && event === "INSERT")
      ? `<div style="background:#b3261e;color:#fff;padding:16px 18px;border-radius:10px;margin:0 0 18px">
           <div style="font-size:19px;font-weight:800;letter-spacing:.5px">🚨 IZREDEN / NUJEN TERMIN</div>
           <div style="margin-top:8px;font-size:15px;line-height:1.5">
             To <strong>ni običajna rezervacija</strong> – termin ni rezerviran v koledarju.<br>
             Stranka čaka na vaš <strong>klic za dogovor</strong>.
           </div>
           <div style="margin-top:12px;font-size:17px;font-weight:700">
             📞 <a href="tel:${String(telefon).replace(/\s/g, "")}" style="color:#fff">${telefon}</a>
           </div>
         </div>
         <div style="background:#fff3cd;border:1px solid #ffe08a;padding:12px 14px;border-radius:8px;margin:0 0 18px">
           <strong>Želja stranke:</strong><br>${String(zelja).replace(/\n/g, "<br>")}
         </div>`
      : "";

    const vrsticaTermin = jeNujni
      ? `<p><strong>Termin:</strong> ni določen – po dogovoru</p>`
      : `<p><strong>Datum:</strong> ${datumSI ?? "-"}</p>
         <p><strong>Ura:</strong> ${uraSI ?? "-"}</p>`;

    const html = `
      <div style="font-family:Arial,sans-serif;color:#2c4251;max-width:600px">
      <h2 style="color:${jeNujni && event === "INSERT" ? "#b3261e" : "#2c4251"}">${mailNaslov}</h2>
      ${opozorilo}
      <p><strong>Storitve:</strong> ${storitve}</p>
      ${vrsticaTermin}
      <p><strong>Skupna cena:</strong> ${cena}</p>
      <p><strong>Trajanje:</strong> ${trajanje}</p>
      <p><strong>Stranka:</strong> ${b.customer_name ?? "-"}</p>
      <p><strong>Telefon:</strong> <a href="tel:${String(telefon).replace(/\s/g, "")}">${telefon}</a></p>
      <p><strong>Email stranke:</strong> ${b.customer_email ?? "-"}</p>
      ${jeNujni && event === "INSERT" ? "" : `<p><strong>Opomba:</strong> ${zelja}</p>`}
      <p><strong>Status:</strong> ${b.status ?? "-"}</p>
      ${manageLink ? `<p><strong>Povezava do urejanja:</strong> <a href="${manageLink}">${manageLink}</a></p>` : ""}
      </div>
    `;

    if (RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Najs rezervacije <onboarding@resend.dev>",
          to: [NOTIFY_EMAIL],
          subject: mailSubject,
          html,
        }),
      });

      // Potrditveni mail stranki samo ob novi rezervaciji
      if (event === "INSERT" && b.customer_email) {
        const imeStranke = b.customer_name ? String(b.customer_name).split(" ")[0] : "";
        const custHtml = jeNujni
          ? `<div style="font-family:Arial,sans-serif;color:#2c4251;max-width:560px">
               <h2 style="color:#2c4251">Prejeli smo vašo nujno zahtevo</h2>
               <p>Pozdravljeni${imeStranke ? " " + imeStranke : ""}, hvala za vaše sporočilo.</p>
               <p>Vaša zahteva <strong>še ni potrjen termin</strong> – v najkrajšem možnem času vas
                  pokličemo na <strong>${telefon}</strong> in se dogovorimo za uro.</p>
               <p><strong>Storitve:</strong> ${storitve}</p>
               <p style="font-size:13px">Če se mudi, nas lahko pokličete tudi sami na
                  <a href="tel:+38631217361" style="color:#d06666">031 217 361</a>.</p>
               <p style="font-size:13px">Lep pozdrav,<br>Frizerski studio Najs</p>
             </div>`
          : `<div style="font-family:Arial,sans-serif;color:#2c4251;max-width:560px">
               <h2 style="color:#2c4251">Vaša rezervacija je sprejeta 💛</h2>
               <p>Pozdravljeni${imeStranke ? " " + imeStranke : ""}, hvala za vaše naročilo v Frizerskem studiu Najs.</p>
               <p>
                 <strong>Storitve:</strong> ${storitve}<br>
                 <strong>Datum:</strong> ${datumSI}<br>
                 <strong>Ura:</strong> ${uraSI}<br>
                 <strong>Cena:</strong> ${cena}
               </p>
               ${manageLink ? `
               <p>Termin lahko <strong>spremenite ali prekličete</strong> prek spodnje povezave (do polnoči dan pred terminom):</p>
               <p><a href="${manageLink}" style="display:inline-block;background:#d06666;color:#fff;text-decoration:none;padding:11px 18px;border-radius:10px;font-weight:600">Moje naročilo</a></p>
               <p style="font-size:12px;color:#7c8a93">Če gumb ne deluje, odprite to povezavo:<br>${manageLink}</p>
               ` : ""}
               <p style="font-size:13px">V primeru vprašanj pokličite <a href="tel:+38631217361" style="color:#d06666">031 217 361</a>.</p>
               <p style="font-size:13px">Lep pozdrav,<br>Frizerski studio Najs</p>
             </div>`;
        try {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: "Najs rezervacije <onboarding@resend.dev>",
              to: [b.customer_email],
              subject: jeNujni ? "Prejeli smo vašo nujno zahtevo – Frizerski studio Najs"
                               : "Potrditev rezervacije – Frizerski studio Najs",
              html: custHtml,
            }),
          });
        } catch (_e) { /* mail stranki ne sme ustaviti funkcije */ }
      }
    }

    // ── Telegram lastniku ────────────────────────────────────
    if (TG_TOKEN && TG_CHAT) {
      let text;
      if (jeNujni && event === "INSERT") {
        text =
          `${tgGlava}\n\n` +
          `‼️ IZREDEN DOGODEK – NI rezerviranega termina!\n` +
          `‼️ Stranka čaka na VAŠ KLIC.\n\n` +
          `📞 TELEFON: ${telefon}\n` +
          `👤 Stranka: ${b.customer_name ?? "-"}\n\n` +
          `📝 ŽELJA STRANKE:\n${zelja}\n\n` +
          `Storitve: ${storitve}\n` +
          `Okvirna cena: ${cena}\n` +
          `Okvirno trajanje: ${trajanje}\n` +
          `Email: ${b.customer_email ?? "-"}\n\n` +
          `🚨 Prosimo, pokličite stranko čim prej. 🚨`;
      } else {
        text =
          `${tgGlava}\n\n` +
          `Storitve: ${storitve}\n` +
          (jeNujni ? `Termin: po dogovoru\n` : `Datum: ${datumSI ?? "-"}\nUra: ${uraSI ?? "-"}\n`) +
          `Skupna cena: ${cena}\n` +
          `Trajanje: ${trajanje}\n` +
          `Stranka: ${b.customer_name ?? "-"}\n` +
          `Telefon: ${telefon}\n` +
          `Email: ${b.customer_email ?? "-"}\n` +
          `Opomba: ${zelja}\n` +
          `Status: ${b.status ?? "-"}` +
          (manageLink ? `\n\nUrejanje: ${manageLink}` : "");
      }
      await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TG_CHAT, text }),
      });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    return new Response(String(e), { status: 500 });
  }
});
