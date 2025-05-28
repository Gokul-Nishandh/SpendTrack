from database import Database

db = Database()


name = "Prashanth"
phone = "1"
password = "1"
dob = "2005-11-05"
 #print(db.add_user(name, phone, password, dob))

# # verifying the user

# print(db.verify_user(phone, password))

# print(db.add_budget(4, 100.0))

# print(db.get_expense(5))

# print(db.add_friend(1, 6))

# print(db.add_friend(3, 1))

# print(db.add_grp_expense(1, 5, 100, 'trip', "2025-01-03", 'cash'))
print(db.get_grp_expense(2))

