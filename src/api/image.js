import { Cloudinary } from "@cloudinary/url-gen/index";

export async function UploadImage(image) {
    if (!image)
    {
        return null;
    }

    const data = new FormData();
    data.append("file", image);
    data.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    )
    data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
    data.append("folder", "Cloudinary-React");

    try {
        const response = await fetch(
            `${process.env.REACT_APP_CLOUDINARY_URL}`,
            {
                method: "POST",
                body: data,
            }
        );
        const res = await response.json();
        return res;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export function FindImage(url) {
    if (!url)
        {
            return null;
        }
    const cld = new Cloudinary({
        cloud: {
            cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
        }
    })

    const myimage = cld.image(url);

    return myimage
}