export const userData = {
    center: "지속 가능한 도전으로,\n다정하고 다재다능한\n창작자가 된다",
    areas: [
        {
            title: "도전 태도",
            items: [
                "월 1회 새로운 시도",
                "24시간 룰로 결정",
                "실패 기록 남기기",
                "선택 이유 정리",
                "눈치 기준 버리기",
                "시도 자체를 성과로",
                "되돌아보지 않기",
                "배운 점 기록"
            ]
        },
        {
            title: "창작 & 제작",
            items: [
                "월 1개 결과물",
                "미완성 공개",
                "바로 MVP",
                "기록 남기기",
                "사이드 프로젝트 유지",
                "완벽주의 금지",
                "아카이빙",
                "공유 채널 고정"
            ]
        },
        {
            title: "커뮤니티",
            items: [
                "주 1회 점검",
                "피드백 받기",
                "작은 미션",
                "운영 피로 관리",
                "규칙 단순화",
                "기록 문화",
                "운영자도 참여",
                "장기 그림 정리"
            ]
        },
        {
            title: "창업 사고",
            items: [
                "아이디어 메모",
                "문제 관찰",
                "BM 스케치",
                "가설 실험",
                "고객 인터뷰",
                "사업 일기",
                "실패 정리",
                "불필요한 것 제거"
            ]
        },
        {
            title: "지속 가능성",
            items: [
                "에너지 점검",
                "과부하 신호 기록",
                "속도 조절",
                "1년 관점 질문",
                "루틴 최소화",
                "중단 기준",
                "휴식 일정화",
                "완급 연습"
            ]
        },
        {
            title: "건강",
            items: [
                "수면 고정",
                "통증 즉시 대응",
                "주 2회 스트레칭",
                "장시간 작업 제한",
                "병원 미루지 않기",
                "가벼운 운동",
                "회복 우선",
                "건강 기록"
            ]
        },
        {
            title: "관계 태도",
            items: [
                "부드러운 말",
                "도움 요청",
                "감사 표현",
                "열정 공유",
                "비교 대화 금지",
                "진심으로 듣기",
                "피로 신호 체크",
                "혼자 버티지 않기"
            ]
        },
        {
            title: "정체성",
            items: [
                "자기 문장 유지",
                "우선순위 명확화",
                "관심사 분류",
                "핵심 역할 3개",
                "정기 점검",
                "나만의 언어",
                "기록으로 고정",
                "남의 정의 거절"
            ]
        }
    ]
};

// Function to convert this structured data into the 9x9 grid array format
export function getPreFilledGrid() {
    // 9 blocks, 9 cells each.
    const grid = Array(9).fill(null).map(() => Array(9).fill(""));

    // Mapping:
    // Center Block (Index 4)
    // 0: Area 1, 1: Area 2, 2: Area 3
    // 3: Area 4, 4: Center, 5: Area 5
    // 6: Area 6, 7: Area 7, 8: Area 8

    // Outer Blocks match these positions.
    // Block 0 corresponds to Center Block Cell 0 (Top Left)

    const mapIndices = [0, 1, 2, 3, 5, 6, 7, 8];

    // Fill Center
    grid[4][4] = userData.center;

    userData.areas.forEach((area, i) => {
        if (i >= mapIndices.length) return;

        const outerBlockIndex = mapIndices[i];

        // Fill Center Block Key Area
        grid[4][outerBlockIndex] = area.title;

        // Fill Outer Block Center
        grid[outerBlockIndex][4] = area.title;

        // Fill Outer Block Items (surrounding the center 4)
        const itemIndices = [0, 1, 2, 3, 5, 6, 7, 8];
        area.items.forEach((item, itemIdx) => {
            if (itemIdx >= itemIndices.length) return;
            const cellIndex = itemIndices[itemIdx];
            grid[outerBlockIndex][cellIndex] = item;
        });
    });

    return grid;
}
