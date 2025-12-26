export type Question = {
    id: number;
    category: string;
    text: string;
};


export const questions: Question[] = [
    {
        id: 1,
        category: "Identity",
        text: "한 해를 한 단어로 요약한다면 뭐였어? 그리고 내년의 나는 어떤 단어로 기억되고 싶어?",
    },
    {
        id: 2,
        category: "Authenticity",
        text: "남들은 뭐라 해도, 내가 끝까지 지켰던 나만의 고집(기준)은 뭐였어?",
    },
    {
        id: 3,
        category: "Satisfaction",
        text: "성과 다 떠나서, 올해 '나 진짜 괜찮았다' 싶었던 순간은 언제야? (태도나 마음가짐에서)",
    },
    {
        id: 4,
        category: "Pattern",
        text: "내 일상에서 '이거 하나는 진짜 끊어내고 싶다'고 느꼈던 지긋지긋한 패턴 있어?",
    },
    {
        id: 5,
        category: "Joy",
        text: "일이나 의무감 다 빼고, 그냥 하는 것만으로도 나를 숨 쉬게 했던 딴짓은 뭐였어?",
    },
    {
        id: 6,
        category: "Work",
        text: "일적으로 '더 높이' 올라가는 거 말고, '어떤 상태'로 일하고 싶다는 마음이 들었어?",
    },
    {
        id: 7,
        category: "Relationship",
        text: "올해 내 곁에 남은 사람들한테 나는 어떤 친구(동료)였던 것 같아?",
    },
    {
        id: 8,
        category: "Unloading",
        text: "내년에 가볍게 날아가려면, 올해 꽉 쥐고 있던 것 중에 뭘 제일 먼저 버려야 할까?",
    },
];
