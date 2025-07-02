
const BADGE_IMAGE_MAPPING = {
    'moyachacha': 'badge_moyachacha.png',
    'moyagosu': 'badge_moyagosu.png', 
    'moyainssa': 'badge_moyainssa.png',
    'moyalearner': 'badge_moyalearner.png',
    'moyasessak': 'badge_moyasessak.png'
  };
  
  export const getBadgeImageUrl = (badgeImg) => {
    const fileName = BADGE_IMAGE_MAPPING[badgeImg];
    
    // 이미지가 없으면 첫 번째 이미지를 기본으로 사용
    if (!fileName) {
      return '/badge_moyasessak.png'; // 기본 이미지로 새싹 사용
    }
    
    return `/${fileName}`; // public 폴더는 /로 시작
  };
  
  //  배지 이미지가 존재하는지 확인
  export const hasBadgeImage = (badgeImg) => {
    return badgeImg in BADGE_IMAGE_MAPPING;
  };
  
  //  모든 배지 이미지 목록 (필요시 사용)
  export const getAllBadgeImages = () => {
    return { ...BADGE_IMAGE_MAPPING };
  };