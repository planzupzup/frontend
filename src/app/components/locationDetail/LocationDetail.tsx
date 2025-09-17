/* eslint-disable */
"use client";

import { ChangeEvent, SetStateAction, useEffect, useRef, useState } from "react";
import style from "./LocationDetail.module.scss";
import axios from "axios";
import classNames from "classnames";
import Flicking from "@egjs/react-flicking";
import { Location } from "@/app/plan/[planId]/page";
import AWS from "aws-sdk";

type TProps = {
    locationId: string;
    setIsShowModal: React.Dispatch<SetStateAction<boolean>>;
    isEdit?: boolean;
    day?: number;
    setTotalLocationList? : React.Dispatch<React.SetStateAction<Location[][]>>;
    locationIndex: number;
}

type TLocation = {
    scheduleOrder: string;
    locationName: string;
    category: string;
    description: string;
    googleImageUrl?: string;
    images?: string[];
}   

const LocationDetail = ({ locationId, setIsShowModal, isEdit, day, setTotalLocationList, locationIndex}:TProps) => {

    const [location, setLocation] = useState<TLocation | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [editedDescription, setEditedDescription] = useState<string>("");
    const [inputImages, setInputImages] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>([]);

      const handleFileChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.files && e.target.files.length > 0) {
            if(e.target.files[0].size > (10 * 1024 * 1024)) {
                alert("10MB 미만 크기의 파일만 업로드 가능합니다.");
                return;
            }

            const selectedFile = e.target.files[0];

            setSelectedFiles(prevFiles => {
                const newFiles = [...prevFiles];
                newFiles[index] = selectedFile;
                return newFiles;
            });
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setInputImages((prevInputImages) => {
                    const newInputImages = [...prevInputImages];
                    newInputImages[index] = reader.result as string;
                    return newInputImages;
                });
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const flickingRef = useRef<Flicking>(null);

      const easing = (x: number) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;


    const goToPrev = () => {
        flickingRef.current?.prev();
    };

    const goToNext = () => {
        flickingRef.current?.next();
    };

    const loadLocation = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACK_HOST}/api/location/${locationId}`,{ withCredentials: true });
          setLocation({scheduleOrder: response.data.result.scheduleOrder, locationName: response.data.result.locationName, category: response.data.result.category, description: response.data.result.description, googleImageUrl: response.data.result.googleImageUrl, images: response.data.result.images});
            setEditedDescription(response.data.result.description);
        } catch (e) {
          alert('지역을 불러오는데 실패했습니다.');
        }
      };

    useEffect(() => {
        console.log(location?.images);
        loadLocation();
    },[]);

    const onClickSaveBtn = async () => {
        try {
            if(setTotalLocationList) {
                setTotalLocationList(prevTotalLocationList => {
                const newTotalLocationList = prevTotalLocationList.map(dayLocations => [...dayLocations]);
                
                if (day !== undefined && day >= 0 && day < newTotalLocationList.length) {

                    const targetLocation = { ...newTotalLocationList[day][locationIndex]};
                    
                    const formData = new FormData();
                    const uploadImagesList = [];
                    selectedFiles.forEach(async (file,index) => {
                        if (file) {
                            formData.append('file', file);
                            const uploadResponse = await fetch('/api/upload', {
                                method: 'POST',
                                body: formData,
                            });
                
                            if (!uploadResponse.ok) {
                                throw new Error('Image upload failed.');
                            }
                
                            targetLocation?.images?[index] = await uploadResponse.json();

                        }
                    });

                    targetLocation.description = editedDescription;

                    // 4. 원래 위치에 수정된 새로운 객체로 교체
                    newTotalLocationList[day][locationIndex] = targetLocation;
                }
                console.log(newTotalLocationList);
                return newTotalLocationList
            });}
            setIsShowModal(false);

        } catch (error) {
            console.error("저장 실패:", error);
            alert("저장에 실패했습니다.");
        }
    }

    const getTotalImageCount = () => {
        let count = 0;
        if (location?.images?.length) {
            count += location.images.length;
        }
        return count;
    };

    const totalImages = getTotalImageCount();

    return (
        <div className={style.dimmed_layer} onClick={() => {setIsShowModal(false);}}>
            <div className={style.modal} onClick={(e) => {e.stopPropagation();}}>
                <div className={style.top}>
                    <span className={style.day}>{location?.scheduleOrder}일차</span>
                    <strong className={style.title}>{location?.locationName}</strong>
                    <span className={classNames(style.category, style.type_tourist)}>{location?.category}관광명소</span>
                    <button type="button" onClick={() => {setIsShowModal(false);}} className={style.close_btn}><span className="blind">닫기</span></button>
                </div>
                <div className={style.flicking_wrap}>
                    <Flicking
                            ref={flickingRef}
                            align="prev"
                            bound={true}
                            onChanged={e => setCurrentIndex(e.index)}
                            easing={easing}
                            duration={600}
                        >
                        <div className={classNames(style.img_wrap, {[style.is_edit] : isEdit})}>
                            {isEdit && <><span className={style.badge_editable}><span className="blind">이미지 수정</span></span><input type="file" className="blind" id="upload_image_1" onChange={(e)=> handleFileChange(e, 0)} accept="image/*"/><label className={style.upload_btn} htmlFor="upload_image_1"></label></>}
                            <img className={style.img} src={inputImages[0]} alt="업로드 이미지"/>
                        </div>
                        <div className={classNames(style.img_wrap, {[style.is_edit] : isEdit})}>
                            {isEdit && <><span className={style.badge_editable}><span className="blind">이미지 수정</span></span><input type="file" className="blind" id="upload_image_2" onChange={(e) => handleFileChange(e, 1)} accept="image/*" /><label className={style.upload_btn} htmlFor="upload_image_2"></label></>}
                            <img className={style.img} src={inputImages[1]} alt="업로드 이미지2"/>
                        </div>
                        <div className={classNames(style.img_wrap, {[style.is_edit] : isEdit})}>
                            {isEdit && <><span className={style.badge_editable}><span className="blind">이미지 수정</span></span><input type="file" className="blind" id="upload_image_3"  onChange={(e) => handleFileChange(e,2)} accept="image/*"/><label className={style.upload_btn} htmlFor="upload_image_3"></label></>}
                            <img className={style.img} src={inputImages[2]} alt="업로드 이미지3"/>
                        </div>
                    </Flicking>
                    { getTotalImageCount() > 1 && 
                    <><button type="button" className={style.prev_btn} onClick={goToPrev}>
                        <span className="blind">이전</span>
                    </button>
                    <button type="button" className={style.next_btn} onClick={goToNext}>
                        <span className="blind">다음</span>
                    </button></> }
                </div>
                {totalImages > 0 &&
                <div className={style.dot_wrap}>
                    {Array.from({ length: totalImages }, (_, index) => (
                        <span
                            key={index}
                            className={classNames(style.dot, { [style.is_active]: index === currentIndex })}
                        ></span>
                    ))}
                </div>
                }
                {isEdit ? <textarea className={style.textarea} value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} placeholder={"사진과 함께, 이곳의 여행 이야기를 들려주세요"}></textarea> : <div className={style.desc_wrap}><p className={style.desc}>{location?.description}</p></div>}
                {isEdit && <button type="button" className={style.save_btn} onClick={onClickSaveBtn}>저장</button>}
            </div>
        </div>
    )
}

export default LocationDetail;