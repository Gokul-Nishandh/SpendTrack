from typing import Optional
from pydantic import BaseModel
from typing import Union
from typing import Optional, Union, List, Dict


class user(BaseModel):
    user_id : Optional[int] = None
    name : Optional[str] = None
    phone : Optional[str] = None
    password : Optional[str] = None
    dob : Optional[str] = None
    amt : Optional[float] = None

class expense(BaseModel):
    user_id : Optional[int] = None
    grp : Optional[int] = None
    amt : Optional[float] = None
    date : Optional[str] = None
    mode : Optional[str] = None
    category : Optional[str] = None
    description : Optional[str] = None

class grp(BaseModel):
    user_id: Optional[Union[int, List[int]]] = None
    grp_name: Optional[str] = None
    grp_id: Optional[int] = None
    amt: Optional[Dict[int, float]] = None  # 👈 Accept dictionary here
    friends: Optional[List] = None
    category: Optional[str] = None
    date: Optional[str] = None
    mode: Optional[str] = None
