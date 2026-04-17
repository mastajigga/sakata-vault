const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Fortuné/Projects/Sakata';

const fr_long = fs.readFileSync(path.join(dir, 'temp_iluo_3000_fr.md'), 'utf8');
const fr_light = fs.readFileSync(path.join(dir, 'temp_iluo_light_fr.md'), 'utf8');
const en = fs.readFileSync(path.join(dir, 'temp_iluo_en.md'), 'utf8');
const lin = fs.readFileSync(path.join(dir, 'temp_iluo_lin.md'), 'utf8');
const skt = fs.readFileSync(path.join(dir, 'temp_iluo_skt.md'), 'utf8');
const swa = fs.readFileSync(path.join(dir, 'temp_iluo_swa.md'), 'utf8');
const tsh = fs.readFileSync(path.join(dir, 'temp_iluo_tsh.md'), 'utf8');

const parseEn = (text) => {
    const parts = text.split('# [Light]');
    return {
        complete: parts[0].trim(),
        light: parts[1] ? parts[1].trim() : parts[0].trim()
    };
};

const en_parsed = parseEn(en);
const lin_parsed = parseEn(lin);
const skt_parsed = parseEn(skt);
const swa_parsed = parseEn(swa);
const tsh_parsed = parseEn(tsh);

const titles = {
    complete: {
        fr: "Iluo : Le Souffle de l'Invisible et le Commandement des Doubles",
        en: "Iluo: The Breath of the Invisible and the Command of the Doubles",
        lin: "Iluo: Mpema ya Nseka mpe Komanda ya ba Double",
        skt: "Iluo: Mpema ya Nseka (Kisakata)",
        swa: "Iluo: Pumzi ya Siri na Amri ya Kivuli",
        tsh: "Iluo: Muuya wa Musokoko ne Bukokeshi bua Kivule"
    },
    light: {
        fr: "Iluo : Le Secret du Double et de l'Excellence",
        en: "Iluo: The Secret of the Double and Excellence",
        lin: "Iluo: Sekele ya Double mpe ya Mayele Makasi",
        skt: "Iluo (Version Courte)",
        swa: "Iluo: Siri ya Kivuli na Ubora",
        tsh: "Iluo: Musokoko wa Kivule ne Meji"
    }
};

const content_complete = {
    fr: fr_long,
    en: en_parsed.complete,
    lin: lin_parsed.complete,
    skt: skt_parsed.complete,
    swa: swa_parsed.complete,
    tsh: tsh_parsed.complete
};

const content_light = {
    fr: fr_light,
    en: en_parsed.light,
    lin: lin_parsed.light,
    skt: skt_parsed.light,
    swa: swa_parsed.light,
    tsh: tsh_parsed.light
};

const sql = `
-- Delete old article
DELETE FROM public.articles WHERE slug = 'iluo-les-doubles';

-- Insert Complete Version
INSERT INTO public.articles (slug, title, content, category, status)
VALUES (
    'iluo-le-pouvoir-du-souffle',
    $TITLE$${JSON.stringify(titles.complete)}$TITLE$::jsonb,
    $CONTENT$${JSON.stringify(content_complete)}$CONTENT$::jsonb,
    'culture',
    'published'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    status = EXCLUDED.status,
    updated_at = now();

-- Insert Light Version
INSERT INTO public.articles (slug, title, content, category, status)
VALUES (
    'iluo-version-courte',
    $TITLE$${JSON.stringify(titles.light)}$TITLE$::jsonb,
    $CONTENT$${JSON.stringify(content_light)}$CONTENT$::jsonb,
    'culture',
    'published'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    status = EXCLUDED.status,
    updated_at = now();
`;

fs.writeFileSync(path.join(dir, 'update_iluo.sql'), sql);
console.log('SQL file generated with dollar-quoting: update_iluo.sql');
