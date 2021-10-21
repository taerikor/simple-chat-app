import React, { useEffect, useState } from "react";
import { authService, dbService } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import AppRouter from "./AppRouter";
import { doc, onSnapshot } from "@firebase/firestore";

export interface userObjState {
  displayName: string;
  userImage: string;
  userDesc: string;
  userId: string;
  userInterface?: User;
}

const App: React.FunctionComponent = () => {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState<userObjState | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      console.log("is work?");
      if (user) {
        setIsLoggedIn(true);
        getUserDoc(user);
      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const getUserDoc = async (data: User) => {
    const docRef = doc(dbService, "users", `${data.uid}`);
    onSnapshot(docRef, (docSnap) => {
      const userData = {
        displayName: docSnap.data()?.displayName,
        userImage: docSnap.data()?.userImage,
        userDesc: docSnap.data()?.userDesc,
        userId: docSnap.data()?.userId,
        userInterface: data,
      };
      setUserObj(userData);
    });
    // const docSnap = await getDoc(docRef);

    // const userQuery = query(collection(dbService, "users"),where("userId","==",data.uid))
    // onSnapshot(userQuery,(snapshot)=>{
    //   let currentUserObj:userObjState[] = snapshot.docs.map((doc)=> ({
    //     displayName: doc.data().displayName,
    //     userImage: doc.data().userImage,
    //     userDesc: doc.data().userDesc,
    //     userId: doc.data().userId
    //   }))
    //   currentUserObj[0].userInterface = data;
    //   setUserObj(currentUserObj[0])
    // })
  };
  return (
    <>
      {init ? (
        <AppRouter userObj={userObj} isLoggedIn={isLoggedIn} />
      ) : (
        "loading..."
      )}
    </>
  );
};

export default App;
