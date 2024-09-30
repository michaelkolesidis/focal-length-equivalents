class ImagingFormat {
  constructor(name, widthInMm, heightInMm) {
    this.name = name;
    this.widthInMm = widthInMm;
    this.heightInMm = heightInMm;
    this.commonFocalLengths = [];
  }

  setCommonFocalLengths(commonFocalLengths) {
    this.commonFocalLengths = commonFocalLengths;
  }

  diagonalInMm() {
    return Math.sqrt(this.widthInMm ** 2 + this.heightInMm ** 2);
  }

  normalFocalLength() {
    return Math.round(this.diagonalInMm());
  }

  equivalentToFocalLengthInFormat(otherFocalLength, otherFormat) {
    return otherFocalLength * this._diagonalRatioToFormat(otherFormat);
  }

  _longestSide() {
    return Math.max(this.widthInMm, this.heightInMm);
  }

  _diagonalRatioToFormat(otherFormat) {
    return this.diagonalInMm() / otherFormat.diagonalInMm();
  }

  _longestSideRatioToFormat(otherFormat) {
    return this._longestSide() / otherFormat._longestSide();
  }
}
