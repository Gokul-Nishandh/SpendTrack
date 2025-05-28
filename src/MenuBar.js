import React from 'react'
import { Link } from 'react-router-dom';

const MenuBar = () => {
  return (
    <main className="home">
    <button className="addexpense">+ Add expenses</button>
        <div className="functions">
            <div className="chatai"><img alt="pho 1"src="https://s3-alpha-sig.figma.com/img/74b5/f45c/6faaab75e5bc26ea93847a2b13792c94?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Jz5L0XpGQ9pvKyZGwHKZZSlxQjlF4entVQv7bnUPqRO5E0LrrdI9C6lcpROxIpnss4VFK9xnxB2RDhqRIo-LsFalfCyhxC0IFSMyqypJV02B8V~lcZWrvuVgwAkgJgl-j6QBSm~CYSud2Q-L6hzZHXccT8be1FJXkO1j78oXSv~5lwUc4fRz4Oa0McsFEbC8WN8g3rJfL2~fllQUJDHYL6a4wgC9DK217aNf0MQyiSldhhkule~ZtCVI4mEJPGAuQP6inBJtSnZoW35UHQOEsj9fzDc873TvM8aQr5ho1Mwk9mRVxyyjgVgIjUHJv~M2oSue3621eqfiOezee0FiDg__" height="63px" width="63px" /><p>Chat with AI</p></div>
            <div className="viewgroups"><img alt="pho 5" height="63px" width="63px" src='https://s3-alpha-sig.figma.com/img/c821/76b2/15bea625427df39a2281368d2de03348?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=jIdTmwbW1Kb6JlBBo6gd8HM8fxsbPmbnGb39tU75aVCreCrZSK~bS0F4qPDMx-Aw8dOXs8zvsGewo3TD7dm6UDBiRnNv5ChB2xBmxurzwB3pgXfOywcPADtxNWlAVAtljzhdXig0PvMCsorbayul7DKbOKCcLGoltTqlxn91I0df6GkxZIlo0nLYqNK7EA~13GbcefVs1MRhekb4~XhMK6V3Rwf9U8blzE6xPNP1ygV~gskHlTXDhpY~6TEyoLnh2QQvmhVxW4O1ezHcZtv~QWTkqDK3kfW1UCXs9daVzZi90QWCGEbsnSGB6L~N5bv8I7LStRvQMZKC~8TJ1ySQnQ__' /><p>View Groups</p></div>
            <div className="trackexpense"><img alt="pho 2"height="63px" width="63px" src="https://s3-alpha-sig.figma.com/img/8605/3969/f9123d83984c89969ffcaa8d0966e6a9?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=QYhCtPwZDPfiAFe5Ot5~IqDZosG2QgIb3G9OSFe7HcfPONSJsYsTt0nhf04oPnfI76XWe1MBDW2cWbwbnCZuecYb5hZziueRr4yhymf3yWW0uTiubO9aDrWhnLilVVcYJCNA8ELiaRxQp3RC-3KKUY3OpDC7lHAa-6xHx2imCuJGoQI8O4uqFgMip3supV05Rr~QOXNBmelhyyky~PqUDtxFYlIf1EdaUk16FmWlIivtgvMQ9A28YfvVWSqzptX~LHqQwdtd0JlRG3aF1rOPINaGI8G1GOrro70WZf9RhBHa1ueDooy50Nu0YZ6-~na-GXz9a4YFkLr8lY3lNwzSyA__" /><p>Track Expenses</p></div>
            <div className="setbudget"><img alt="pho 3"height="63px" width="63px" src="https://s3-alpha-sig.figma.com/img/780a/4415/c035f1d45c069ec9d60377316a50d50b?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ewo5bcLXU1GLVQfTQG2yrsyEfHLvQry~0KyjyD7RmqlSwKqUUwzHtzk7Fn70r7GJbJiO7Wz38t7wiOektBwD1~qBIeU4HU6Sl~GBtlPflt7HfZ8q4ilkTokLWxoKGt9kRVMkuSL71jWvhoAHqUqhE9-dlFjnkcnvoseZOaEj-3KKXaeogl05JHH6knwwspg1uat5NY4yGkWaqUsEqyDCSFYssyYqYjmqC8nZkVATfCc9PnyElp6fWqgfvk8UrlIR-~f2qH9lDlD-J-L~LSuTRhkAl1cw4EpvM2eJJYv3uGdCIZ8~vAutXWTGrixVV13J2OYsUQJk2~prtvQzYp8b-A__" /><p>Set Budget</p></div>
            <div className="banksync"><img alt="pho 4"height="63px" width="63px" src="https://s3-alpha-sig.figma.com/img/235d/0a15/060790f6e3eb648e3343f20b1fec60e8?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=j02jAg4W5L0nYoXGicvFrka8EsuErIRRFlYL9B4-70QAl~dj6uBMX9l8UEijMTu97bES9JUKTVH6nrWvcQc1T2Ce6kFhrNdvrsK8BW4pyFWHe2lrfR~44fSaYqgjDPP93OgWXwtYoKeTPhItOGLHxQRWAMoUt1ZyRp-NMJWUBJ2b3VlvG3C4vJwBPAz5PDAobboO27H8kt0qte9mOiRBA1niue6dnWb8cXZF0Ldz1g02~vO~rvXkEFlcJScZyy57dGqt-eY-qjfrk-0o5W9tG0ydByx8sdKA6Jb4DlkFY-T3lPqZIOT4suwdnEap3yeyrxuXNIXqYweOK742n2dOzA__" /><p>Sync Bank Transactions</p></div>
    </div>
    <div className="menubarmain">
      <Link to="/menubar/recents"><div>Recents</div></Link>
      <Link to="/menubar/addnewfriends"><div>+ Add New Friends</div></Link>
      <div>Chats</div>
      <div>View Achievements</div>
      <Link to="/"><div>Close Menu</div></Link>
    </div>
    </main>
  )
}

export default MenuBar