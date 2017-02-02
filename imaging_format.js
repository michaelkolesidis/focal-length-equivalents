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
    return Math.sqrt(
      Math.pow(this.widthInMm, 2) + Math.pow(this.heightInMm, 2)
    );
  }

  normalFocalLength() {
    return Math.round(this.diagonalInMm());
  }

  equivalentToFocalLengthInFormat(otherFocalLength, otherFormat) {
    // diagonal-based
    return otherFocalLength * this._diagonalRatioToFormat(otherFormat);

    // width-based
    // return otherFocalLength * this._longestSideRatioToFormat(otherFormat)
  }

  _longestSide() {
    if (this.widthInMm > this.heightInMm) {
      return this.widthInMm;
    } else {
      return this.heightInMm;
    }
  }

  _diagonalRatioToFormat(otherFormat) {
    return this.diagonalInMm() / otherFormat.diagonalInMm();
  }

  _longestSideRatioToFormat(otherFormat) {
    return this._longestSide() / otherFormat._longestSide();
  }
}
