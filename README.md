# Site HE2DIHÉLIA, SARL

Site institucional do grupo, com uma secção animada para cada uma das 5 empresas, galeria de fotos/vídeos por empresa, e um feed de notícias — tudo editável sem precisar de mexer no código, através de um painel de administração.

## Estrutura do projeto

```
index.html              → página principal (não precisa de editar para trocar textos)
css/styles.css          → estilo visual do site
js/main.js              → liga o site aos ficheiros de conteúdo
content/companies.json  → textos, cores e galerias das 5 empresas + dados do grupo
content/news.json       → notícias do feed
assets/logos/           → logótipos (incluindo o conceito para a Fábrica de Gelo)
assets/uploads/         → aqui ficam as fotos/vídeos enviados pelo painel (criada automaticamente)
admin/                  → painel de administração (Decap CMS)
```

## 1. Testar no seu computador antes de publicar

Os textos são carregados de ficheiros JSON, por isso **não abra o `index.html` a duplo-clique** — o navegador bloqueia essa leitura por segurança. Em vez disso, abra um terminal na pasta do projeto e corra:

```
python3 -m http.server 8000
```

Depois abra `http://localhost:8000` no navegador.

## 2. Publicar o site (grátis)

A forma mais simples de publicar e já ficar com o painel de edição a funcionar:

1. Crie uma conta em **github.com** (se ainda não tiver) e crie um repositório novo, por exemplo `he2dihelia-site`.
2. Envie todos os ficheiros desta pasta para esse repositório (pode arrastar os ficheiros na própria página do GitHub, em "Add file → Upload files").
3. Crie uma conta em **netlify.com** e escolha "Add new site → Import an existing project → GitHub", selecionando o repositório que criou.
4. Deixe as definições por omissão (não precisa de "build command") e clique em "Deploy". Em 1–2 minutos o site fica online, com um endereço tipo `he2dihelia.netlify.app`.
5. Nas definições do Netlify pode depois ligar o vosso domínio próprio (ex: `he2dihelia.gw` ou `.com`), em "Domain settings".

## 3. Ativar o painel de edição (`/admin`)

O painel permite trocar textos, cores, adicionar fotos/vídeos e publicar notícias sem tocar em código.

1. No site do Netlify, vá a **Site configuration → Identity** e clique "Enable Identity".
2. Em Identity → Registration, escolha "Invite only" (para só a vossa equipa poder entrar).
3. Ative também o **Git Gateway** (dentro de Identity → Services).
4. Em Identity → "Invite users", convide os e-mails de quem vai gerir o site. Eles recebem um e-mail para criar password.
5. Para editar, acedam a `https://o-vosso-site.netlify.app/admin` e entrem com esse login.

A partir daí, o painel mostra dois grupos:
- **Grupo & Empresas** — dados do grupo, e para cada empresa: nome, cores, slogan, descrição, lista de serviços e a galeria de fotos/vídeos.
- **Notícias / Feed** — para acrescentar novidades a qualquer momento.

Cada alteração feita no painel é guardada automaticamente no GitHub e o Netlify publica a nova versão sozinho, em cerca de 1 minuto.

## 4. Adicionar fotos e vídeos

- **Fotos**: pode enviar diretamente pelo painel (campo "Ficheiro" da galeria).
- **Vídeos**: para vídeos maiores, o mais leve é subir o vídeo ao YouTube ou Facebook (não listado) e colocar o link de incorporação no campo "Ficheiro" — vídeos muito grandes tornam o site lento se forem carregados diretamente. Para clipes curtos (poucos segundos), pode enviar o ficheiro de vídeo diretamente, tal como uma foto.

## 5. Editar sem usar o painel (alternativa)

Também pode editar diretamente os ficheiros `content/companies.json` e `content/news.json` num editor de texto, seguindo a mesma estrutura que já lá está, e depois enviar (`upload`) o ficheiro atualizado ao GitHub — o Netlify publica automaticamente.

## 6. Sobre o logótipo da Fábrica de Gelo

Foi criado um primeiro conceito em `assets/logos/baloba-gelo-puro.svg`, no mesmo estilo circular das outras empresas do grupo, com um floco de gelo ao centro e a paleta azul-gelo. Fica com o nome de trabalho **BALOBA GELO PURO** — pode ser ajustado (nome, cores, tipografia) por um designer gráfico depois, bastando substituir esse ficheiro e/ou atualizar o campo `logo` da empresa `fabrica-de-gelo` no `content/companies.json` ou no painel.

## 7. Editar contactos, telefones e moradas (grupo e cada empresa)

Cada empresa — e também o grupo — já tem os seus próprios campos de **morada, telefone/WhatsApp e e-mail** no `content/companies.json`, prontos a preencher. Duas formas de os alterar:

**Pelo painel `/admin` (mais fácil):**
1. Entrem em `/admin` e abram "Grupo & Empresas".
2. Para a morada/telefone/e-mail da sede, abram o bloco "Grupo" → "Contacto do grupo".
3. Para cada empresa, abram-na na lista "Empresas" e desçam até "Contacto da empresa".
4. Preencham e cliquem em "Publicar" — o site atualiza-se sozinho em cerca de 1 minuto.

**Editando o ficheiro diretamente:**
Abram `content/companies.json` e procurem, dentro de cada empresa (e também dentro de `"grupo"`), o bloco:
```json
"contacto": {
  "morada": "...",
  "telefone": "...",
  "email": "..."
}
```
Substituam os valores de exemplo (como `[adicionar morada]`) pelos dados reais e guardem o ficheiro.

O contacto do grupo aparece na secção "Contacto" no fim do site; o contacto de cada empresa aparece na própria secção dessa empresa, por baixo da lista de serviços.

## 8. Adicionar Instagram, Facebook e TikTok

Tal como os contactos, cada empresa (e também o grupo) já tem campos prontos para os links do Instagram, Facebook e TikTok. Quando os preencherem, aparece automaticamente um pequeno botão para cada rede social, logo a seguir aos contactos dessa empresa (ou do grupo).

**Pelo painel `/admin`:** abram o grupo ou a empresa desejada e desçam até "Redes sociais" — colem aí o link completo de cada rede (ex: `https://www.instagram.com/balobatchonfirme`).

**No ficheiro `content/companies.json`:** dentro de cada empresa (e também dentro de `"grupo"`), procurem:
```json
"redes_sociais": {
  "instagram": "",
  "facebook": "",
  "tiktok": ""
}
```
e colem o link completo de cada rede dentro das aspas. Se uma empresa não tiver, por exemplo, TikTok, basta deixar `""` vazio — o botão dessa rede simplesmente não aparece no site.
