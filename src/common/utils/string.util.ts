/**
 * Chuyển đổi tiếng Việt có dấu sang không dấu
 * @param str - Chuỗi cần chuyển đổi
 * @returns Chuỗi đã chuyển đổi không dấu
 */
export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  
  return str;
}

/**
 * Tạo regex pattern để search không phân biệt dấu tiếng Việt
 * @param searchText - Text cần search
 * @returns Regex pattern
 */
export function createVietnameseRegex(searchText: string): RegExp {
  if (!searchText) return /.*/;
  
  // Escape special regex characters
  const escaped = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Chuyển sang không dấu để search
  const normalized = removeVietnameseTones(escaped);
  
  // Tạo pattern với các ký tự có dấu và không dấu
  let pattern = '';
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i].toLowerCase();
    
    // Map các ký tự sang pattern có thể match cả có dấu và không dấu
    switch (char) {
      case 'a':
        pattern += '[aàáạảãâầấậẩẫăằắặẳẵAÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]';
        break;
      case 'e':
        pattern += '[eèéẹẻẽêềếệểễEÈÉẸẺẼÊỀẾỆỂỄ]';
        break;
      case 'i':
        pattern += '[iìíịỉĩIÌÍỊỈĨ]';
        break;
      case 'o':
        pattern += '[oòóọỏõôồốộổỗơờớợởỡOÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]';
        break;
      case 'u':
        pattern += '[uùúụủũưừứựửữUÙÚỤỦŨƯỪỨỰỬỮ]';
        break;
      case 'y':
        pattern += '[yỳýỵỷỹYỲÝỴỶỸ]';
        break;
      case 'd':
        pattern += '[dđDĐ]';
        break;
      default:
        pattern += char;
    }
  }
  
  return new RegExp(pattern, 'i');
}

