import mysql.connector as sql
class Database:

    def __init__(self, host = None, user = None, passwrd = None, db = NotImplemented):

        self._mydb = sql.connect(host = "localhost", user="root", passwd="Gokul@2005", db = "spendtrack")
        self._cur = self._mydb.cursor()
        
    def __str__(self):
        return str(self._mydb)

    def isNone(self, value):
        if value == None:
            return True
        return False
    
    def connection(self):
        if not self._mydb.is_connected():
            self._mydb.reconnect()
            self._cur = self._mydb.cursor()
            return
        self._cur.fetchall()
        self._cur.close()
        self._cur = self._mydb.cursor() 

    def add_user(self, name, phone, password, dob):
        self._cur.execute(f"select user_id from user_data where phone = '{phone}'") 
        user_id = self._cur.fetchall()
        print("Fetched user_id for phone:", phone, " => ", user_id)
        if user_id and len(user_id) > 0:
            return False
        self._cur.execute(f"insert into user_data (name, phone, password, dob) value('{name}', '{phone}', '{password}', '{dob}')")
        self._mydb.commit()
        return self.verify_user(phone, password)
    
    def verify_user(self, phone, password):
        self._cur.execute(f"select user_id, name from user_data where phone = '{phone}' and password = '{password}'")
        user_id = self._cur.fetchone()
        if Database.isNone(self, user_id):
            return False
        return user_id

    def add_expense(self, user_id, amt, category, date, mode, description = None):
        
        if description != None:
            self._cur.execute(f"insert into expense(user_id, amt, category, date, mode, description) value({user_id}, {amt}, '{category}', '{date}', '{mode}', '{description}')")       
        else:
            self._cur.execute(f"insert into expense(user_id, amt, category, date, mode) value({user_id}, {amt}, '{category}', '{date}', '{mode}')")  
        self._mydb.commit()
        self._cur.execute("SELECT LAST_INSERT_ID()")
        return self._cur.fetchall()[0][0]
    
    def add_budget(self, user_id, amt):
        self._cur.execute(f"update user_data set budget = {amt} where user_id = {user_id}")
        self._mydb.commit()
        return True
    
    def get_user_id(self, phone):
        self._cur.execute(f"select user_id from user_data where phone = {phone}")
        return self._cur.fetchone()
    
    def get_budget(self, user_id):
        self.connection()
        self._cur.execute(f"select budget from user_data where user_id = {user_id}")
        amt =  self._cur.fetchone()
        if self.isNone(amt):
            return None
        return amt[0]
    
    def get_expense(self, user_id):
        self.connection()
        self._cur.execute(f"select amt, category, date, mode, description from expense where user_id = {user_id}")
        all_expense = []
        col_name = ('amt', 'category', 'date', 'mode', 'description')
        for i in self._cur.fetchall():
            expense = {}
            for j, k in zip(col_name, i):
                expense[j] = k
            all_expense.append(expense)
        return all_expense
    
    def add_friend(self, user_id, friend_phone):
        self.connection()
        friend_id = self.get_user_id(friend_phone)
        if self.isNone(friend_id):
            return False
        self._cur.execute("insert into friends value(%s, %s)", (user_id, friend_id[0]))
        self._mydb.commit()
        return True
    
    def add_grp(self, grp_name):
        self._cur.execute("insert into grp(grp_name) value(%s)", (grp_name,))
        self._mydb.commit()
        self._cur.execute("SELECT LAST_INSERT_ID()") 
        grp_id = self._cur.fetchall()
        return grp_id[0][0]
    
    def add_grp_user(self, grp_id, user_id):
        self._cur.execute("insert into grp_has_user value(%s, %s)", (user_id, grp_id))
        self._mydb.commit()
        return True
    
    def get_friends(self,  user_id):
        self._cur.execute("SELECT u.name AS friend_name, u.user_id as friend_id  FROM friends f JOIN user_data u ON f.friend_id = u.user_id WHERE f.user_id = %s", (user_id,))
        col_name = ["friend_name","friend_id"]
        friends = []
        for i in self._cur.fetchall():
            expense = {}
            for j, k in zip(col_name, i):
                expense[j] = k
            friends.append(expense)
        return friends
    
    def get_grp(self, user_id):
        self._cur.execute("SELECT g.grp_id, g.grp_name FROM grp_has_user gu JOIN grp g ON gu.grp_id = g.grp_id WHERE gu.user_id = %s", (user_id,))
        grps = []
        col_name = ["grp_id", "grp_name"]
        for i in self._cur.fetchall():
            grp = {}
            for j, k in zip(col_name, i):
                grp[j] = k
            grps.append(grp)
        return grps
    
    def add_grp_expense(self, grp_id, user_id, amt, category, date, mode):
    
            expense_id = self.add_expense(user_id, amt, category, date, mode)
            self._cur.execute(
                "INSERT INTO grp_has_expense (grp_id, expense_id) VALUES (%s, %s)",
                (grp_id, expense_id))
    
            self._mydb.commit()
            return True
    
    def get_user(self, user_id):
        self._cur.execute(f"select name, phone, password, dob, user_id from user_data where user_id = {user_id}")
        col_name = ['name', 'phone', 'password', 'dob', "user_id"]
        user = {}
        for i, j in zip(col_name,self._cur.fetchall()[0]):
            user[i] = j
        return user
    
    def get_grp_expense(self, grp_id):
        self._cur.execute(f"select e.user_id , sum(e.amt) from expense as e join grp_has_expense as g on e.expense_id = g.expense_id where g.grp_id = {grp_id} group by e.user_id")
        col_name = ["user_id", "amt"]
        result = []
        for i in self._cur.fetchall():
            dic = {}
            for j, k in zip(col_name, i):
                dic[j] = k
            result.append(dic)
        print(result)
        return result

    def get_grp_friend(self, grp_id):
        self._cur.execute(f"select user_id from grp_has_user where grp_id = {grp_id}")
        friends = []
        for i in self._cur.fetchall():
            friends.append(self.get_user(i[0]))
        return friends

