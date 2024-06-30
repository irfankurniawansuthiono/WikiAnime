import { Link, useLocalSearchParams } from "expo-router";
import {Image, View, ScrollView,  Alert} from "react-native";
import {Layout, Text, Icon, Button} from "@ui-kitten/components";
import LoadingComponent from "@/components/Loading/Loading";
import YoutubePlayer from "react-native-youtube-iframe";
import React, { useEffect, useState } from "react";
import { ExternalLink } from "@/components/ExternalLink";
import axios from "axios";
import {getAccountData} from "@/utils/storage";
import {addToFirestoreBookmark, checkUserBookmarks, removeUserBookmark} from "@/utils/FireStoreAction";
export default function AnimeDetails() {
  const [loading, setLoading] = useState<boolean>(true);
  const [animeDetails, setAnimeDetails] = useState<any>(null);
  const [youtubeError, setYoutubeError] = useState<boolean>(false);
  const [hasBookmark, setHasBookmark] = useState<boolean>(false);
  const [bookmarkButtonLoading, setBookmarkButtonLoading] = useState<boolean>(false);
  const { id } = useLocalSearchParams();
  const [userData, setUserData] = useState<any>(null);
  const fetchAnimeDetails = async () => {
    const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if(response.status !== 200){
      throw new Error("error fetch anime details")
    }else{
      return response.data;
    }
  };

  const fetchAccountData = async () => {
    const data = await getAccountData();
    if (data.status === 200) {
      return data.data
    }
  };

  const checkBookmark = async(uid:any, animeID:any)=>{
    setBookmarkButtonLoading(true)
    const response = await checkUserBookmarks(uid, animeID)
      if (response.status == 200) {
        setHasBookmark(true);
        setBookmarkButtonLoading(false)
      }else{
        setHasBookmark(false)
        setBookmarkButtonLoading(false)
      }
  }
  useEffect(()=>{
    if(userData!==null){
      checkBookmark(userData.user.uid, animeDetails.data.mal_id).then().finally(()=>{
        setLoading(false)
      })
    }
  }, [animeDetails, userData])

  useEffect(() => {
    const fetchData = async () => {
      try {
      const [animeDetailsData, userAccountData] = await Promise.all([
        fetchAnimeDetails(), fetchAccountData()
      ]);
        setAnimeDetails(animeDetailsData);
        setUserData(userAccountData)
      }catch(err){
        console.error(err)
      }
    };

    fetchData();
  }, []);

  // addToBookmark
  const addToBookmark = async() =>{
    const uid = userData.user.uid
    const animeID = animeDetails.data.mal_id
    try {
      const response = await addToFirestoreBookmark(uid,animeID, animeDetails.data)
      if(response.status == 200){
        setHasBookmark(true)
      }else{
        throw new Error(response.message)
      }
    }catch(err){
      console.error(err)
    }
  }
  const removeFromBookmark = async()=>{
    const uid = userData.user.uid;
    const animeID = animeDetails.data.mal_id;
    const response = await removeUserBookmark(uid,animeID);
    if(response.status === 200){
      setHasBookmark(false)
    }else{
      throw new Error(response.message)
    }
  }


  return loading ? (
    <LoadingComponent />
  ) : (
    <ScrollView style={{ backgroundColor: "#fff" }}  showsVerticalScrollIndicator={false}>
      <Layout level="1" style={{ padding: 10 }}>
        <Text category="h6" style={{ fontWeight: "bold", marginBottom: 10 }}>
          {animeDetails?.data?.title}
        </Text>
        <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
            }}
        >
          <Image
              source={{ uri: animeDetails?.data?.images?.webp?.large_image_url }}
              style={{
                flex: 0.75,
                borderWidth: 4,
                borderColor: "#3366ff",
                borderRadius: 10,
              }}
              resizeMode="cover"
          />
          <View
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
          >
            {animeDetails?.data?.title_japanese ? (
                <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flexWrap: "wrap",
                    }}
                >
                  <Text category="s2" style={{ fontWeight: "bold" }}>
                    Japanese Title :
                  </Text>
                  <Text style={{ width: "100%", color: "#3366ff" }}>
                    {animeDetails?.data?.title_japanese}
                  </Text>
                </View>
            ) : (
                <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                      flexWrap: "wrap",
                    }}
                >
                  <Text category="s2" style={{ fontWeight: "bold" }}>
                    Japanese Title :
                  </Text>
                  <Text style={{ width: "100%", color: "#3366ff" }}>
                    No Title
                  </Text>
                </View>
            )}
            <View>
              {animeDetails?.data?.type ? (
                  <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 2,
                      }}
                  >
                    <Text category="s2" style={{ fontWeight: "bold" }}>
                      Streaming :
                    </Text>
                    <Text style={{ width: "100%", color: "#3366ff" }}>
                      {animeDetails?.data?.type}
                    </Text>
                  </View>
              ) : (
                  <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 2,
                      }}
                  >
                    <Text category="s2" style={{ fontWeight: "bold" }}>
                      Streaming :
                    </Text>
                    <Text style={{ width: "100%", color: "red" }}>Null</Text>
                  </View>
              )}
            </View>
            <View>
              {animeDetails?.data?.source ? (
                  <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 2,
                      }}
                  >
                    <Text category="s2" style={{ fontWeight: "bold" }}>
                      Source :
                    </Text>
                    <Text style={{ width: "100%", color: "#3366ff" }}>
                      {animeDetails?.data?.source}
                    </Text>
                  </View>
              ) : (
                  <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 2,
                      }}
                  >
                    <Text category="s2" style={{ fontWeight: "bold" }}>
                      Source :
                    </Text>
                    <Text style={{ width: "100%", color: "red" }}>Null</Text>
                  </View>
              )}
            </View>
            <View>
              {animeDetails?.data?.episodes ? (
                  <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 2,
                      }}
                  >
                    <Text category="s2" style={{ fontWeight: "bold" }}>
                      Episodes :
                    </Text>
                    <Text style={{ width: "100%", color: "#3366ff" }}>
                      {animeDetails?.data?.episodes} eps
                    </Text>
                  </View>
              ) : (
                  <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 2,
                      }}
                  >
                    <Text category="s2" style={{ fontWeight: "bold" }}>
                      Episodes :
                    </Text>
                    <Text style={{ width: "100%", color: "red" }}>Null</Text>
                  </View>
              )}
            </View>
            <View>
              {animeDetails?.data?.airing ? (
                  <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 2,
                      }}
                  >
                    <Text category="s2" style={{ fontWeight: "bold" }}>
                      Status :
                    </Text>
                    <Text style={{ width: "100%", color: "#3366ff" }}>
                      Ongoing
                    </Text>
                  </View>
              ) : (
                  <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 2,
                      }}
                  >
                    <Text category="s2" style={{ fontWeight: "bold" }}>
                      Status :
                    </Text>
                    <Text style={{ width: "100%", color: "#3366ff" }}>
                      Completed
                    </Text>
                  </View>
              )}
            </View>
            <View>
              {animeDetails?.data?.duration ? (
                  <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 2,
                      }}
                  >
                    <Text category="s2" style={{ fontWeight: "bold" }}>
                      Duration :
                    </Text>
                    <Text style={{ width: "100%", color: "#3366ff" }}>
                      {animeDetails?.data?.duration}
                    </Text>
                  </View>
              ) : (
                  <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 2,
                      }}
                  >
                    <Text category="s2" style={{ fontWeight: "bold" }}>
                      Duration :
                    </Text>
                    <Text style={{ width: "100%", color: "red" }}>Null</Text>
                  </View>
              )}
            </View>
            <View>
              {animeDetails?.data?.season ? (
                  <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 2,
                      }}
                  >
                    <Text category="s2" style={{ fontWeight: "bold" }}>
                      Season :
                    </Text>
                    <Text style={{ width: "100%", color: "#3366ff" }}>
                      {animeDetails?.data?.season}
                    </Text>
                  </View>
              ) : (
                  <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 2,
                      }}
                  >
                    <Text category="s2" style={{ fontWeight: "bold" }}>
                      Season :
                    </Text>
                    <Text style={{ width: "100%", color: "red" }}>Null</Text>
                  </View>
              )}
            </View>
            <View>
              {animeDetails?.data?.year ? (
                  <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 2,
                      }}
                  >
                    <Text category="s2" style={{ fontWeight: "bold" }}>
                      Year :
                    </Text>
                    <Text style={{ width: "100%", color: "#3366ff" }}>
                      {animeDetails?.data?.year}
                    </Text>
                  </View>
              ) : (
                  <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 2,
                      }}
                  >
                    <Text category="s2" style={{ fontWeight: "bold" }}>
                      Year :
                    </Text>
                    <Text style={{ width: "100%", color: "red" }}>Null</Text>
                  </View>
              )}
            </View>
            <View>
              {animeDetails?.data?.score ? (
                  <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 2,
                      }}
                  >
                    <Text category="s2" style={{ fontWeight: "bold" }}>
                      Score :
                    </Text>
                    <Text style={{ width: "100%", color: "#3366ff" }}>
                      {animeDetails?.data?.score}
                    </Text>
                  </View>
              ) : (
                  <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 2,
                      }}
                  >
                    <Text category="s2" style={{ fontWeight: "bold" }}>
                      Score :
                    </Text>
                    <Text style={{ width: "100%", color: "red" }}>Null</Text>
                  </View>
              )}
            </View>
          </View>
        </View>
        <View style={{ display: "flex", gap: 20, marginTop: 20 }}>
          <View style={{ width: "100%", display: "flex", gap: 5 }}>
            {animeDetails?.data?.genres.length !== 0 ? (
                <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 5,
                    }}
                >
                  {animeDetails?.data?.genres.map((item: any) => (
                      <Link
                          key={item.mal_id}
                          href={`/SearchAnime?g=${item.mal_id}&name=${item.name}`}
                      >
                        <Layout
                            style={{
                              backgroundColor: "#3366ff",
                              paddingHorizontal: 10,
                              paddingVertical: 5,
                              borderRadius: 20,
                            }}
                        >
                          <Text category="s2" style={{ color: "#fff" }}>
                            {item.name}
                          </Text>
                        </Layout>
                      </Link>
                  ))}
                </View>
            ) : (
                <Text style={{ color: "red" }}>Genre Not Available</Text>
            )}
          </View>
          {hasBookmark ? (
              bookmarkButtonLoading ? (
                  <Button accessoryLeft={<Icon name={"LoadingIndicator"}/>} >Loading...</Button>
                  ):(
                  <Button
                      accessoryLeft={<Icon name={"bookmark"}/>}
                      status="basic"
                      onPress={()=> removeFromBookmark()}
                  >
                    Remove Bookmark
                  </Button>
                  )
          ):(
              bookmarkButtonLoading ? (
                  <Button accessoryLeft={<Icon name={"LoadingIndicator"}/>} >Loading...</Button>
              ):(
                <Button accessoryLeft={<Icon name={"bookmark-outline"}/>} onPress={()=> addToBookmark()}>Add to Bookmark</Button>
              ))}
          <View>
            {animeDetails?.data?.studios.length !== 0 ? (
                <View
                    style={{
                      display: "flex",
                      gap: 5,
                    }}
                >
                  <Text category="h6" style={{ fontWeight: "bold" }}>
                    Studios :
                  </Text>
                  <View
                      style={{
                        display: "flex",
                        gap: 10,
                        flexDirection: "row",
                        flexWrap: "wrap",
                      }}
                  >
                    {animeDetails?.data?.studios.map(
                        (item: any, index: number) => (
                            <ExternalLink key={item.mal_id} href={item.url}>
                              <View>
                                <Layout
                                    level="4"
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      gap: 5,
                                      paddingHorizontal: 10,
                                      paddingVertical: 5,
                                      borderRadius: 10,
                                      backgroundColor: "crimson",
                                    }}
                                >
                                  <Icon
                                      name="tv-outline"
                                      style={{ width: 20, height: 20 }}
                                      fill="#fff"
                                  />
                                  <Text
                                      category="s1"
                                      style={{ color: "#fff", fontWeight: "bold" }}
                                  >
                                    {item.name}
                                  </Text>
                                </Layout>
                              </View>
                            </ExternalLink>
                        )
                    )}
                  </View>
                </View>
            ) : (
                <View
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 2,
                    }}
                >
                  <Text category="h6" style={{ fontWeight: "bold" }}>
                    Studios :
                  </Text>
                  <Text style={{ width: "100%", color: "red" }}>
                    Studios Not Available
                  </Text>
                </View>
            )}
          </View>
          <View style={{ width: "100%", display: "flex", gap: 5 }}>
            <Text category="h6">Producers : </Text>
            {animeDetails?.data?.producers.length !== 0 ? (
                <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 5,
                    }}
                >
                  {animeDetails?.data?.producers.map((item: any) => (
                      <ExternalLink key={item.mal_id} href={item.url}>
                        <Layout
                            level="4"
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 5,
                              borderRadius: 20,
                            }}
                        >
                          <Text category="s2" style={{ color: "#3366ff" }}>
                            {item.name}
                          </Text>
                        </Layout>
                      </ExternalLink>
                  ))}
                </View>
            ) : (
                <Text style={{ color: "red" }}>Not Available</Text>
            )}
          </View>

          <View style={{ display: "flex", gap: 5 }}>
            <Text category="h6">Stream On : </Text>
            <View>
              {animeDetails?.data?.streaming.length !== 0 ? (
                  <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 10,
                      }}
                  >
                    {animeDetails?.data?.streaming.map(
                        (item: any, index: number) => (
                            <View
                                key={index}
                                style={{
                                  backgroundColor: "#F79041",
                                  paddingVertical: 10,
                                  paddingHorizontal: 15,
                                  borderRadius: 5,
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: 10,
                                  alignItems: "center",
                                }}
                            >
                              <Icon
                                  name="film-outline"
                                  fill="#fff"
                                  style={{ width: 20, height: 20 }}
                              />
                              <ExternalLink href={item.url}>
                                <Text style={{ color: "#fff" }}>{item.name}</Text>
                              </ExternalLink>
                            </View>
                        )
                    )}
                  </View>
              ) : (
                  <Text style={{ color: "red" }}>Not Available</Text>
              )}
            </View>
          </View>

          {animeDetails?.data?.trailer?.youtube_id ? (
              youtubeError ? (
                  <Text>Error, Videos might be unavailable</Text>
              ) : (
                  <View style={{ display: "flex", gap: 5 }}>
                    <Text category="h6">Trailer :</Text>
                    <YoutubePlayer
                        height={200}
                        videoId={animeDetails?.data?.trailer?.youtube_id}
                        onError={() => setYoutubeError(true)}
                    />
                  </View>
              )
          ) : (
              <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 5,
                  }}
              >
                <Text category="h6" style={{ fontWeight: "bold" }}>
                  Trailers :
                </Text>
                <Text style={{ width: "100%", color: "red" }}>Not Available</Text>
              </View>
          )}
          {animeDetails?.data?.synopsis ? (
              <View style={{ display: "flex", gap: 5 }}>
                <Text category="h6">Synopsis :</Text>
                <Text style={{ textAlign: "justify" }}>
                  {animeDetails?.data?.synopsis}
                </Text>
              </View>
          ) : (
              <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 2,
                  }}
              >
                <Text category="h6" style={{ fontWeight: "bold" }}>
                  Synopsis :
                </Text>
                <Text style={{ width: "100%", color: "#3366ff" }}>
                  Not Available
                </Text>
              </View>
          )}
        </View>
        <View style={{ marginTop: 10 }}>
          <Layout level="3" style={{ padding: 10 }}>
            {animeDetails?.data?.theme ? (
                <View>
                  <Text category="h6">Songs :</Text>
                  <View style={{ display: "flex", gap: 10 }}>
                    <View style={{ marginLeft: 10 }}>
                      <Text category="s1">Opening :</Text>
                      <View style={{ display: "flex", gap: 10 }}>
                        {animeDetails?.data?.theme?.openings.map(
                            (item: string, index: number) => (
                                <Text
                                    key={index}
                                    category="s2"
                                    style={{ color: "#3366ff", marginLeft: 20 }}
                                >
                                  {item}
                                </Text>
                            )
                        )}
                      </View>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                      <Text category="s1">Ending :</Text>
                      <View style={{ display: "flex", gap: 10 }}>
                        {animeDetails?.data?.theme?.endings.map(
                            (item: string, index: number) => (
                                <Text
                                    key={index}
                                    category="s2"
                                    style={{ color: "#3366ff", marginLeft: 20 }}
                                >
                                  {item}
                                </Text>
                            )
                        )}
                      </View>
                    </View>
                  </View>
                </View>
            ) : (
                <View style={{ marginLeft: 10 }}>
                  <Text category="h6">Songs :</Text>
                  <View
                      style={{ display: "flex", flexDirection: "row", gap: 10 }}
                  >
                    <Text category="s2">Opening :</Text>
                    <Text style={{ color: "red" }}>Null</Text>;
                  </View>
                  <View
                      style={{ display: "flex", flexDirection: "row", gap: 10 }}
                  >
                    <Text category="s2">Ending :</Text>
                    <Text style={{ color: "red" }}>Null</Text>;
                  </View>
                </View>
            )}
          </Layout>
        </View>
      </Layout>
    </ScrollView>
  );
}
