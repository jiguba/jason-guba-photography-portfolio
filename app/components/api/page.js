import Flickr from "flickr-sdk";
import Image from "next/image";
import Box from '@mui/material/Box';

const FLICKR_API_KEY = process.env.FLICKR_API_KEY;
const PHOTOSET_ID = process.env.PHOTOSET_ID;
const USER_ID = process.env.USER_ID;
const flickr = new Flickr(FLICKR_API_KEY);

const DAY_IN_SECONDS = 86400

import PhotoGallery from "../PhotoGallery";


const FLICKR_URL = process.env.FLICKR_URL

export async function GET() {
    
    const res = await fetch(FLICKR_URL, {next: { revalidate: DAY_IN_SECONDS, cache: 'no-store'}});
    // const res = await fetch(FLICKR_URL);

    if(!res.ok) {
        throw new Error("Failed to fetch photo data");
    }

    const photosData = await res.json();

    const photos = photosData.photoset.photo;
    // return NextResponse.json(photosData);
    return photos;

}

export default async function Carousel() {

    const photosData = await GET();
    // console.log("RNDERING", photosData)

    const imagePromises = photosData.map(async (photo, index) => {
        const photoID = photo.id;
        const server = photo.server
        const title = photo.title;
        
        const [originalSecret, originalFormat, originalSize] = await fetchPhotoInfo({photo_id: photoID})
        const width = originalSize.width
        const height = originalSize.height
        
        const url = `https://live.staticflickr.com/${server}/${photoID}_${originalSecret}_o.${originalFormat}`;

        return (
                <Image 
                    src={url}
                    key={index}
                    title={title}
                    width={width > height ? 960 : 540}
                    height={width > height ? 540 : 960}
                    alt=""
                    object-fit="cover"
                    style={{display: 'flex', 
                        alignItems: 'end', 
                        border:5, 
                        borderStyle:'solid', 
                        borderColor: "#000"
                    }}
                />
        );
    });    

    const imageElements = await Promise.all(imagePromises);

    return <PhotoGallery images = {imageElements} />
}

async function fetchPhotoInfo({photo_id: photoID}) {
    const photoInfo = await flickr.photos.getInfo({photo_id: photoID});
    const sizes = await flickr.photos.getSizes({photo_id: photoID});

    const originalSecret = photoInfo.body.photo.originalsecret;
    const originalFormat = photoInfo.body.photo.originalformat;
    const originalSize = sizes.body.sizes.size.pop();

    return [originalSecret, originalFormat, originalSize];
}