# Ideas for Project Improvement - TechWatch AI

Hada howa l-file li fih ga3 l-mola7adat o l-idées bach n-miziw l-project dyalk (PFE) o y-welli professionnel aktar.

## 1. Security (Scurité) 🔒
*   **Centralisation dyal l-keys**: Rak dayr `.env` o hadik hya l-bidaya l-mziana. Walakin, l-workflow dyal `n8n` fih wa7d `X-API-KEY` m-hardcodia (`super_secret_internal_key`). Khassna n-rej3ouha variable bach mat-pushach l-Git.
*   **Validation dyal l-Inputs**: f-`routes.py`, l-forms dyal l-sources khasshoum chwya dial ta7ki9 (validation) bach m-idkholch ayi khra b7al SQL Injection (wakha SQLAlchemy kat-7mi, walakin l-validation mziana).
*   **Production Config**: Khassna n-far9ou bin `Development` o `Production` f-`config.py`.

## 2. Structure dyal l-Code (Shortcuts & Simplifications) 🛠️
*   **Refactoring l-logic d-Scraping**: Kat-3awd l-code dial processing (Scraping + AI + DB) f-jouj blays (`scrape_source` o `run_daily_cron`). Khassna n-diroha f-service wa7d (b7al `article_service.py`) bach l-code y-welli 9ssir o sahel f-l-maintenance.
*   **Async Processing**: Scraping o AI k-yakhou l-we9t. Ila knti k-tscrapi bzaf d-les sources, l-broswer y-9der y-dir "timeout". Mzian n-fekro f-Cery ola ghi n-optimiziw l-way li k-n-diro biha scrap f-l-background.
*   **Fallback Logic**: Rak dayr fallback mzian f-l-AI, walakin n-9dro n-zido n-7ssnoh bach y-kon dki khtar 7ta bla API Key.

## 3. Style & UI/UX (Aesthetics) ✨
*   **Glassmorphism**: N-rej3o l-cards o sidebar fihom dik l-glass effect (transparent + blur) bach y-welli l-design "Premium".
*   **Charts & Visuals**: F-l-Dashboard, n-9dro n-zido Charts (b-Chart.js) k-i-biyeno les catégories li khtar k-i-t-scrapaw.
*   **Animations**: Ziyadt subtle transitions f-l-hover dial les boutons o les links.
*   **Modern Typography**: Rak khdam b-Inter, hya zwina bzaf. N-9dro n-zido n-l-3bo b-l-font-weights bach n-biyeno l-hiérarchie d-l-ma3lomat.

## 4. Advice (Nassi7a) 💡
*   **Documentation**: Bach l-prof dyalk y-welli "impressed", khassk dir `README.md` n9i fih kifach t-installer l-project o les technos l-m-sta3mla.
*   **Logging**: Zid logging f-l-code (f-blasset `print`) bach t-3ref ach k-i-tra f-l-background khousoussan f-scraping.

---
**Ila wafé9ti 3la had l-idées, golha liya bach n-bda n-tabe9 f-dakchi li tlbti (Security first + Refactoring).**
