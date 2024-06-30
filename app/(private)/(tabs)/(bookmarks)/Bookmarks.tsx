import React, { useState, useEffect } from 'react';
import {Text, Layout, Icon} from '@ui-kitten/components';
import { getUserBookmarks } from '@/utils/FireStoreAction';
import { getAccountData } from '@/utils/storage';
import LoadingComponent from '@/components/Loading/Loading';
import {FlatList, Image, TouchableOpacity, View, RefreshControl} from "react-native";
import {Link, router} from "expo-router";
export default function Bookmarks() {
    const [loading, setLoading] = useState(true);
    const [bookmarkList, setBookmarkList] = useState([]);
    const [userData, setUserData] = useState(null);
    const [isRefreshing, setRefreshing] = useState<boolean>(false);
    const fetchAccountData = async () => {
        const response = await getAccountData();
        return response.data;
    };

    const fetchUserBookmark = async (uid:any) => {
        const response = await getUserBookmarks(uid);
        return response.data;
    };
    const fetchData = async (isRefreshing = false) => {
        try {
            if (isRefreshing) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const accountData = await fetchAccountData();
            setUserData(accountData);

            if (accountData && accountData.user && accountData.user.uid) {
                const bookmarkListData = await fetchUserBookmark(accountData.user.uid);
                if (JSON.stringify(bookmarkList) !== JSON.stringify(bookmarkListData)) {
                    setBookmarkList(bookmarkListData);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            if (isRefreshing) {
                setRefreshing(false);
            } else {
                setLoading(false);
            }
        }
    };

    const onRefresh = async()=>{
        if (userData !== null) {
            // @ts-ignore
            const bookmarkListData = await fetchUserBookmark(userData.user.uid);

            if (JSON.stringify(bookmarkList) !== JSON.stringify(bookmarkListData)) {
                setBookmarkList(bookmarkListData);
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <LoadingComponent/>;
    }

    const renderItem = ({ item }: any) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    router.push(`/Details?id=${item.mal_id}`);
                }}
                style={{
                    borderBottomWidth: 1,
                    borderColor: "#C8C8C8",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    gap: 5,
                }}
            >
                <Image
                    style={{ flex: 1 }}
                    resizeMode="cover"
                    source={{ uri: item.images.webp.large_image_url }}
                />
                <View style={{ flex: 1, paddingVertical: 10 }}>
                    <Text category="s1" style={{ fontWeight: "bold", color: "#3366ff" }}>
                        {item.title}
                    </Text>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Text category="s2">Type : </Text>
                        <Text category="s2" style={{ color: "#3366ff" }}>
                            {item.type ? item.type : "-"}
                        </Text>
                    </View>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Text category="s2">Episodes : </Text>
                        <Text category="s2" style={{ color: "#3366ff" }}>
                            {item.episodes ? item.episodes : "-"}
                        </Text>
                    </View>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Text category="s2">Status : </Text>
                        <Text category="s2" style={{ color: "#3366ff" }}>
                            {item.airing ? "Ongoing" : "Completed"}
                        </Text>
                    </View>

                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Text category="s2">Year : </Text>
                        <Text category="s2" style={{ color: "#3366ff" }}>
                            {item.year ? item.year : "-"}
                        </Text>
                    </View>

                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                        }}
                    >
                        <Icon
                            name="star"
                            style={{ width: 15, height: 15 }}
                            fill="#f79041"
                        />
                        <Text category="s2" style={{ color: "#3366ff" }}>
                            {item.score ? item.score : "-"}
                        </Text>
                    </View>
                    <View style={{ width: "100%", display: "flex", gap: 5 }}>
                        {item?.genres.length !== 0 ? (
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    gap: 5,
                                }}
                            >
                                {item?.genres.map((genre: any) => (
                                    <Link
                                        key={genre.mal_id}
                                        href={`/SearchAnime?g=${genre.mal_id}&name=${genre.name}`}
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
                                                {genre.name}
                                            </Text>
                                        </Layout>
                                    </Link>
                                ))}
                            </View>
                        ) : (
                            <Text style={{ color: "red" }}>Genre Not Available</Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Layout style={{height:"100%", padding: 10, gap: 10}}>
            <View>
                <Text category="s2" style={{ fontWeight: "bold", color: "red" }}>
                    Didn't find newest bookmarks ? swipe down to refresh
                </Text>
            </View>
        <View>
            <FlatList
                data={bookmarkList}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListEmptyComponent={<Text style={{ textAlign: "center" }}>No bookmarks found</Text>}
            />
        </View>
        </Layout>
    );
}
