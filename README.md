# רשימת פיצ'רים

מערכת הזמנות קטנה בשלושה רכיבים:

| תיקייה | תפקיד | טכנולוגיה | כתובת |
|---|---|---|---|
| `client` | שני המסכים | React, Redux Toolkit, TypeScript, Vite | http://localhost:5173 |
| `catalog-api` | קטגוריות ומוצרים (מסך ראשון) | .NET 10, EF Core, SQL Server | http://localhost:5222 |
| `orders-api` | שמירת הזמנות (מסך שני) | Node, Express, Mongoose, MongoDB | http://localhost:3001 |

## דרישות

- .NET SDK 10
- Node.js 22 ומעלה
- SQL Server, כולל LocalDB שמותקן יחד עם Visual Studio
- MongoDB Community Server

## בסיסי הנתונים

שני בסיסי הנתונים צריכים לפעול על המחשב לפני הפעלת השרתים. אין צורך ליצור בהם דבר: בסיס הנתונים של הקטלוג, הטבלאות ונתוני הדוגמה נוצרים בהפעלה הראשונה של `catalog-api`, ובסיס הנתונים של ההזמנות נוצר כשנשמרת ההזמנה הראשונה.

**SQL Server.** ברירת המחדל היא LocalDB עם הזדהות של Windows, בלי שם משתמש וסיסמה:

```
Server=(localdb)\MSSQLLocalDB;Database=Catalog;Trusted_Connection=True
```

לעבודה מול שרת אחר מעדכנים את `ConnectionStrings:Catalog` בקובץ `catalog-api/appsettings.Development.json`. לדוגמה, ל-SQL Server Express:

```
Server=localhost\SQLEXPRESS;Database=Catalog;Trusted_Connection=True;TrustServerCertificate=True
```

**MongoDB.** התקנה רגילה מאזינה ב-`localhost:27017`, וזו הכתובת שהפרויקט מצפה לה, כך שאין מה להגדיר. אם MongoDB רץ בכתובת אחרת, מגדירים את משתנה הסביבה `MONGO_URL` לפני הפעלת `orders-api`.

## הרצה

הדרך המהירה: הסקריפט מתקין את החבילות אם צריך, מפעיל את שלושת הרכיבים, כל אחד בחלון משלו, ופותח את הדפדפן כשהקטלוג מוכן:

```
powershell -ExecutionPolicy Bypass -File start.ps1
```

או ידנית, כל רכיב בטרמינל משלו:

```
cd catalog-api
dotnet run
```

```
cd orders-api
npm install
npm start
```

```
cd client
npm install
npm run dev
```

ופותחים את http://localhost:5173.

## בדיקות

```
cd client && npm test
cd orders-api && npm test
```

## החלטות

- הקטלוג כולו נטען בקריאה אחת בעליית הדף, והסינון לפי קטגוריה נעשה בלקוח.
- ב-store נמצאים הקטלוג, הסל ומצב שליחת ההזמנה. הבחירה הנוכחית בטופס והשדות של מסך הסיכום נשארים ב-state מקומי של הקומפוננטה.
- הוספה של מוצר שכבר נמצא בסל מגדילה את הכמות שלו ולא יוצרת שורה נוספת.
- ה-API של הקטלוג מחזיר DTO בהקרנה ישירה מהשאילתה ולא את ישויות ה-EF.
- בסיס הנתונים של הקטלוג נוצר ומתעדכן ב-migrations שרצות בעליית השרת.
- הזמנה נשמרת כמסמך אחד שכולל את פרטי הלקוח ואת מערך המוצרים, עם שם המוצר והקטגוריה כפי שהיו בזמן ההזמנה.
- שדות החובה נבדקים בדפדפן ושוב בשרת, בסכמה של Mongoose.
- שרת ההזמנות אינו מאמת את המוצרים מול הקטלוג. במערכת אמיתית הייתי מוסיף קריאה בין השירותים.
- הסל אינו נשמר ברענון הדף.
