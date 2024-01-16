# newgenforms.com

Micro surveys tool.

---

* NextJS
* Vercel storage
* Prisma
* ShadcnUI
* Tailwind
* AuthJS

---
Local database

```bash
docker run -d -e POSTGRES_DB=<mydb> -e POSTGRES_PASSWORD=<mypassword> -e POSTGRES_USER=default -p "6500:5432" --name ngf-postgres postgres
```