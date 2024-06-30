import React, { useEffect, useState } from "react";
import { View } from "react-native";
import OddGallery from "./GalleryComponent/OddGallery";
import EvenGallery from "./GalleryComponent/EvenGallery";

interface GalleryLayoutProps {
  data: any[];
}

const GalleryLayout: React.FC<GalleryLayoutProps> = ({ data }) => {
  const [animeData, setAnimeData] = useState<any[][]>([]);

  useEffect(() => {
    const tempData: any[][] = [];
    let chunk: any[] = [];

    data.forEach((item, index) => {
      chunk.push(item);
      if ((index + 1) % 6 === 0 || index === data.length - 1) {
        tempData.push(chunk);
        chunk = [];
      }
    });

    setAnimeData(tempData);
  }, [data]);

  return (
    <View style={{ gap: 5 }}>
      {animeData.map((item, index) =>
        index % 2 === 0 ? (
          <OddGallery key={index} data={item} />
        ) : (
          <EvenGallery key={index} data={item} />
        )
      )}
    </View>
  );
};

export default GalleryLayout;
