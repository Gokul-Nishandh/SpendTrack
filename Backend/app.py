from fastapi import FastAPI, HTTPException
from database import Database
from fastapi.middleware.cors import CORSMiddleware
from entities import user, expense, grp
app = FastAPI()
db = Database()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.post("/signup")
async def signup(request : user):
    user_id = db.add_user(request.name, request.phone, request.password, request.dob)
    if not user_id:
        raise HTTPException(status_code=409, detail="user already exist")
    return {"Message" : "new user successfully added", "user_id" : user_id[0]}

@app.post("/login")
async def login(request : user):
    user = db.verify_user(request.phone, request.password)
    if not user:
        raise HTTPException(status_code=401, detail="phone number or password is incorrect")
    return {"user_id" : user[0], "name" : user[1]}

@app.post("/add-expense")
async def add_expense(request : expense):
    db.add_expense(request.user_id, request.amt, request.category, request.date, request.mode, request.description)
    return {"message" : "successfully added"}

@app.post("/add-budget")
async def add_budget( request : user):
    db.add_budget(request.user_id, request.amt)
    return {"message" : "successfully updated"}

@app.post("/add-friend")
async def addFriend(request : user):
    if  db.add_friend(request.user_id, request.phone):
        return {"message" : "added successfully"}
    return {"message" : "phone number not found"}

@app.post("/budget")
async def get_budget(request : user):  
    return {"budget" : db.get_budget(request.user_id)}

@app.post("/expense")
async def getExpense(request : user):
    return db.get_expense(request.user_id)

@app.post("/friends")
async def getFriends(request : user):
    return db.get_friends(request.user_id)

@app.post("/add-grp")
async def addGrp(request : grp):
    grp_id = db.add_grp(request.grp_name)
    db.add_grp_user(grp_id, request.user_id)
    return {"message" : "grp added Successfully"}

@app.post("/grp/add-friends")
async def addGrpFriends(request : grp):
    for friend_id in request.friends:
        db.add_grp_user(request.grp_id, friend_id)
    return {"message" : "friends successfully added"}

@app.post("/grp")
async def getGrp(request : grp):
    return db.get_grp(request.user_id)

@app.post("/grp/add-expense")
async def addGrpExpense(request : grp):
    for i in request.amt:
        print(request.grp_id, i, request.amt[i], request.category, request.date, request.mode)
        db.add_grp_expense( request.grp_id, i, request.amt[i], request.category, request.date, request.mode)
    return {"message" : "added successfully"}

@app.post("/grp/expense")
async def getGrpExpense(request : grp):
    return db.get_grp_expense(request.grp_id)

@app.post("/grp/friends")
async def getGrpFriends(request : grp):
    return db.get_grp_friend(request.grp_id)

@app.post("/user")
async def getUser(request : user):
    return db.get_user(request.user_id)

if __name__ == "__main__":
    pass