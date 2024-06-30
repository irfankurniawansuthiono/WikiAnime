import {FIREBASE_DB} from "@/config/FirebaseConfig";
import {setDoc, doc, getDocs, collection, deleteDoc} from "firebase/firestore";
export const addToFirestoreBookmark = async(uid : any,animeID : any,  data : any)=>{
    const stringUID = String(uid);
    const stringAnimeID = String(animeID);
    try {
        const docRef = doc(FIREBASE_DB, "users-bookmark", stringUID,  "bookmarks",stringAnimeID);
        await setDoc(docRef, data);

        return {"status" : 200, "message": "success"};
    }catch(err){
        console.error(err)
        return {"status" : 500, "message": "internal server error"};
    }
}

export const getUserBookmarks = async (uid: any) => {
    const stringUID = String(uid);
    try {
        let SnapShotArr:any = []
        const querySnapShot = await getDocs(collection(FIREBASE_DB, "users-bookmark", stringUID,"bookmarks"))
        querySnapShot.forEach((item)=>{
            SnapShotArr.push(item.data())
        })
        return {"status":200, "message": "success", "data": SnapShotArr};
    }catch(err){
        console.error(err)
        return {"status" : 500, "message": "internal server error", "data": null};
    }
}

export const checkUserBookmarks = async(uid: any, animeID:any)=>{
    const stringUID = String(uid);
    const stringAnimeID = String(animeID);
    try {
    const querySnapShot = await getDocs(collection(FIREBASE_DB, "users-bookmark", stringUID,"bookmarks"))
        let animeIDExists = false;
        querySnapShot.forEach((doc) => {
            if (doc.id === stringAnimeID) {
                animeIDExists = true;
            }
        });

        if (animeIDExists) {
            return { "status": 200, "message": "Document with animeID found" };
        } else {
            return { "status": 404, "message": "Document with animeID not found" };
        }
    }catch(err){
        console.error(err)
        return {"status" : 500, "message": "internal server error"};
    }
}

export const removeUserBookmark = async(uid:any, animeID:any)=>{
    const stringUID = String(uid);
    const stringAnimeID = String(animeID);
    try {
        const docRef = doc(FIREBASE_DB, "users-bookmark", stringUID,  "bookmarks",stringAnimeID);
        await deleteDoc(docRef);
        return {"status" : 200, "message": "success"};
    }catch(err){
        console.error(err);
        return {"status" : 500, "message": "internal server error"};
    }
}