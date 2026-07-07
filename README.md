# Dream-Blog
This project created with Kobika , Makilini and Thanoyan.

## 🚀 Quick Start

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

## For Seeding 

```
# On Mac/Linux
source venv/bin/activate

# On Windows (Command Prompt)
venv\Scripts\activate

# On Windows (PowerShell)
.\venv\Scripts\activate

```

```
# On Mac/Linux
export PYTHONPATH=$PYTHONPATH:.
python app/database/Seed_db.py  

# On Windows (PowerShell)
$env:PYTHONPATH="."
python app/database/Seed_db.py

# On Windows (Command Prompt)
set PYTHONPATH=.
python app/database/Seed_db.py

```