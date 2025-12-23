export type Question = {
    id: number;
    category: string;
    text: string;
};

export const questions: Question[] = [
    {
        id: 1,
        category: "Choice",
        text: "올해 내가 가장 자주 했던 “선택”은 뭐였어요? (미루기/밀어붙이기/도망/정면돌파 같은)",
    },
    {
        id: 2,
        category: "Standard",
        text: "내가 올해 끝까지 지키고 싶었던 ‘나의 기준’은 뭐였어요?",
    },
    {
        id: 3,
        category: "Authenticity",
        text: "올해 나를 가장 나답게 만든 순간은 언제였어요?",
    },
    {
        id: 4,
        category: "Lost",
        text: "반대로, 올해 내가 나를 잃었다고 느낀 순간은 언제였어요?",
    },
    {
        id: 5,
        category: "Avoidance",
        text: "내가 반복해서 피했던 감정/상황은 뭐였어요? (불안, 비교, 책임, 외로움 등)",
    },
    {
        id: 6,
        category: "Habit",
        text: "내가 진짜로 더 늘리고 싶은 습관 1개는 뭐예요? (작아도 됨)",
    },
    {
        id: 7,
        category: "Passion",
        text: "내 창작/개발/기록에서 “이건 계속 하고 싶다” 싶은 건 뭐였어요?",
    },
    {
        id: 8,
        category: "Career",
        text: "커리어에서 내가 원하는 방향은 ‘더 크게’가 아니라 ‘더 어떤 상태’예요?",
    },
    {
        id: 9,
        category: "Relationship",
        text: "관계에서 내가 되고 싶은 사람은 어떤 사람이었어요? (친구/동료/가족 포함)",
    },
    {
        id: 10,
        category: "Vision",
        text: "내년의 나를 한 문장으로 미리 소개한다면, 뭐라고 말하고 싶어요?",
    },
];
