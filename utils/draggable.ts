export const getSelectedBox = (images, x, y, h, w) => {
	for (let i = images.length - 1; i >= 0; i--) {
		const image = images[i];
		if (
			x >= image.abscissa &&
			x <= image.abscissa + h &&
			y >= image.ordinate &&
			y <= image.ordinate + w
		) {
			return image;
		}
	}
	return null;
};
