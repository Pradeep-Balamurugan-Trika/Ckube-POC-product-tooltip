"use client";

import { useEffect, useRef, useState } from "react";
import { SideMenu } from "./side-menu";
import { getSelectedBox } from "@/utils/draggable";

export const CanvasComponent = () => {
	const canvasRef = useRef(null);
	const [imageList, setImageList] = useState([]);
	let isDragging = false;
	let selectedImage = null;
	let prevSelectedImage = null;
	let startX = null;
	let startY = null;
	let canvas: any;
	let ctx = null;
	useEffect(() => {
		canvas = canvasRef.current;
		ctx = canvas.getContext("2d");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		ctx.imageSmoothingEnabled = false;
		// ctx.fillRect(0, 0, canvas.width, canvas.height);
		if (imageList.length) {
			imageList.forEach((listItem, i) => {
				fetchImage(listItem, i, ctx);
			});
		}
	}, [imageList]);

	const drawCanvas = () => {
		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
		imageList.forEach((image, i) => fetchImage(image, i, ctx));
	};

	function translatedX(x) {
		var rect = canvas.getBoundingClientRect();
		var factor = canvas.width / rect.width;
		return factor * (x - rect.left);
	}

	function translatedY(y) {
		var rect = canvas.getBoundingClientRect();
		var factor = canvas.width / rect.width;
		return factor * (y - rect.top);
	}

	const getImageTooltip = (
		x: number,
		y: number,
		boxX: number,
		boxY: number
	) => {
		var info = Math.sqrt(
			Math.pow(x - (boxX + 100 / 2 - 40), 2) +
				Math.pow(y - (boxY - 30), 2)
		);
		var edit = Math.sqrt(
			Math.pow(x - (boxX + 100 / 2), 2) + Math.pow(y - (boxY - 30), 2)
		);
		var cancel = Math.sqrt(
			Math.pow(x - (boxX + 100 / 2 + 40), 2) +
				Math.pow(y - (boxY - 30), 2)
		);

		if (info <= 15) {
			window.alert("info");
			return false;
		} else if (edit <= 16) {
			window.alert("edit");
			return false;
		} else if (cancel <= 15) {
			window.alert("cancel");
			return false;
		}

		return true;
	};
	const createBoxEdit = (x, y, colour, w) => {
		if (ctx === null) {
			return;
		}
		ctx.fillStyle = colour;
		ctx.strokeStyle = colour;

		ctx.beginPath();
		ctx.arc(x + w / 2 - 40, y - 30, 15, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.font = "20px serif";
		ctx.fillText("i", x + w / 2 - 43, y - 25);

		ctx.beginPath();
		ctx.arc(x + w / 2, y - 30, 16, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
		ctx.font = "13px ";
		ctx.fillStyle = "white";
		ctx.fillText("\u{270E}", x + w / 2 - 8, y - 23);
		ctx.fillStyle = colour;

		ctx.beginPath();
		ctx.arc(x + w / 2 + 40, y - 30, 15, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.font = "20px serif";
		ctx.fillText("x", x + w / 2 + 35, y - 25);
	};

	const getHoveredBox = (images, x, y, h, w) => {
		for (let i = images.length - 1; i >= 0; i--) {
			const image = images[i];
			if (
				x >= image.abscissa + h / 2 - 65 &&
				x <= image.abscissa + h / 2 + 65 &&
				y >= image.ordinate - 45 &&
				y <= image.ordinate + w
			) {
				return image;
			}
		}
		return null;
	};

	const handleMouseDown = (e) => {
		console.log(
			`mouse down! --> ${translatedX(e.clientX)} ${translatedY(
				e.clientY
			)}`
		);
		startX = translatedX(e.clientX);
		startY = translatedY(e.clientY);
		const mouseX = translatedX(e.clientX);
		const mouseY = translatedY(e.clientY);
		selectedImage = getSelectedBox(imageList, mouseX, mouseY, 100, 100);
		isDragging = !!selectedImage;

		if (selectedImage == null && prevSelectedImage !== null) {
			getImageTooltip(
				mouseX,
				mouseY,
				prevSelectedImage.abscissa,
				prevSelectedImage.ordinate
			);
		}
	};

	const handleMouseMove = (e) => {
		const mouseX = translatedX(e.clientX);
		const mouseY = translatedY(e.clientY);
		if (!isDragging) {
			selectedImage = getHoveredBox(imageList, mouseX, mouseY, 100, 100);
			if (selectedImage === null && prevSelectedImage !== null) {
				prevSelectedImage = null;
				drawCanvas();
			} else if (selectedImage !== null && prevSelectedImage === null) {
				prevSelectedImage = selectedImage;
				console.log(selectedImage);
				createBoxEdit(
					selectedImage.abscissa,
					selectedImage.ordinate,
					selectedImage.type === "source"
						? "#7a80f8"
						: selectedImage.type === "destination"
						? "#ef78d4"
						: "black",
					100
				);
			}
		} else {
			const deltaX = mouseX - startX;
			const deltaY = mouseY - startY;
			startX = mouseX;
			startY = mouseY;

			if (selectedImage) {
				selectedImage.abscissa += deltaX;
				selectedImage.ordinate += deltaY;
				drawCanvas();
				createBoxEdit(
					selectedImage.abscissa,
					selectedImage.ordinate,
					selectedImage.type === "source"
						? "#7a80f8"
						: selectedImage.type === "destination"
						? "#ef78d4"
						: "black",
					100
				);
			}
		}
	};

	const handleMouseUp = () => {
		console.log(`mouse u`);
		isDragging = false;
		selectedImage = null;
	};

	const generateUniqueCoordinates = () => {
		const randomX = Math.floor(Math.random() * 1000);
		const randomY = Math.floor(Math.random() * 530);
		return [randomX, randomY];
	};

	const fetchImage = (listItem: any, i: any, context: any) => {
		const image = new Image();
		const svgImage =
			listItem.type === "source"
				? "../svg-img/source.svg"
				: listItem.type === "destination"
				? "../svg-img/destination.svg"
				: "../svg-img/datamodel.svg";
		const svgText = listItem.name;

		image.src = svgImage;
		image.onload = () => {
			context.drawImage(
				image,
				listItem.abscissa,
				listItem.ordinate,
				100,
				100
			);
			context.font = "18px Arial";
			context.fillStyle = `${
				listItem.type === "source"
					? "#7a80f8"
					: listItem.type === "destination"
					? "#ef78d4"
					: "black"
			}`;
			context.fillText(
				svgText,
				listItem.abscissa,
				listItem.ordinate + 120
			);
		};
	};

	const addToList = (item: any) => {
		const [randomX, randomY] = generateUniqueCoordinates();
		const newItem = {
			...item,
			abscissa: randomX,
			ordinate: randomY,
		};

		const hasCollision = imageList.some((existingItem: any) => {
			const horizontalCollision =
				newItem.abscissa < existingItem.abscissa + 100 &&
				newItem.abscissa + 100 > existingItem.abscissa;

			const verticalCollision =
				newItem.ordinate < existingItem.ordinate + 100 &&
				newItem.ordinate + 100 > existingItem.ordinate;

			return horizontalCollision && verticalCollision;
		});

		const hasWallCollision = () => {
			const horizontalCollision =
				newItem.abscissa + 100 > canvas.width ||
				newItem.abscissa - 100 < 0;
			const verticalCollision =
				newItem.ordinate + 100 > canvas.height ||
				newItem.abscissa - 100 < 0;
			return horizontalCollision || verticalCollision;
		};

		if (hasCollision || hasWallCollision()) {
			addToList(item);
		} else {
			setImageList((prevItems) => [...prevItems, newItem]);
		}
	};

	return (
		<div className="flex">
			<div className="w-3/12 h-screen bg-[#C0BFFF] relative border-box p-3.5 rounded">
				<SideMenu addToList={addToList} />
			</div>
			<div className="w-9/12 relative bg-white">
				<canvas
					ref={canvasRef}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					className="border-box border-2 border-red border-solid"
				/>
			</div>
			<div>
				<button className="btn btn-primary">Save State</button>
			</div>
		</div>
	);
};
