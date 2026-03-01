// Pet Store Database
const products = [
  // Cat Products - Litter & Toilet
  {
    id: 1,
    name: "Cát vệ sinh cao cấp (10kg)",
    category: "cat",
    subcategory: "litter",
    price: 150000,
    image: "cat-litter.svg",
    description: "Cát vệ sinh cho mèo, không bụi, khử mùi hiệu quả, an toàn",
    relatedProducts: [2, 6, 7],
    tags: ["mèo", "vệ sinh", "cát"]
  },
  {
    id: 2,
    name: "Bồn vệ sinh cho mèo - Đôi",
    category: "cat",
    subcategory: "toilet",
    price: 350000,
    image: "cat-toilet.svg",
    description: "Bồn vệ sinh kiểu dáng hiện đại, dễ vệ sinh, có siêu",
    relatedProducts: [1, 7],
    tags: ["mèo", "bồn vệ sinh", "toilet"]
  },
  {
    id: 14,
    name: "Cát vệ sinh hạt tròn",
    category: "cat",
    subcategory: "litter",
    price: 120000,
    image: "cat-litter-pellets.svg",
    description: "Cát hạt tròn, khô nhanh, giảm mùi",
    relatedProducts: [2, 1],
    tags: ["mèo", "vệ sinh", "cát"]
  },
  {
    id: 15,
    name: "Cát vệ sinh gỗ tự nhiên",
    category: "cat",
    subcategory: "litter",
    price: 180000,
    image: "cat-litter-wood.svg",
    description: "Cát từ gỗ tự nhiên, an toàn, hữu cơ",
    relatedProducts: [1, 2],
    tags: ["mèo", "vệ sinh", "cát", "tự nhiên"]
  },
  
  // Cat Products - Housing & Bedding
  {
    id: 3,
    name: "Nhà mèo đa tầng - Premium",
    category: "cat",
    subcategory: "housing",
    price: 800000,
    image: "cat-house.svg",
    description: "Nhà mèo với nhiều tầng, chất liệu bền vững, lắp ráp dễ",
    relatedProducts: [5, 4],
    tags: ["mèo", "nhà ở", "đồ chơi"]
  },
  {
    id: 5,
    name: "Nệm mèo cao cấp - Lớn",
    category: "cat",
    subcategory: "bedding",
    price: 200000,
    image: "cat-bed.svg",
    description: "Nệm mèo êm ái, giữ ấm hiệu quả, có thể giặt",
    relatedProducts: [3, 4],
    tags: ["mèo", "nệm", "giường"]
  },
  {
    id: 16,
    name: "Giường mèo dạng túi ấm",
    category: "cat",
    subcategory: "bedding",
    price: 280000,
    image: "cat-bed-bag.svg",
    description: "Giường mèo dạng túi, giữ ấm, tạo cảm giác an toàn",
    relatedProducts: [5, 3],
    tags: ["mèo", "giường", "ấm"]
  },

  // Cat Products - Toys & Food
  {
    id: 4,
    name: "Chuỗi đồ chơi cho mèo - Set 5",
    category: "cat",
    subcategory: "toys",
    price: 50000,
    image: "cat-toy.svg",
    description: "Bộ 5 chuỗi đồ chơi tương tác, giúp mèo vận động",
    relatedProducts: [3, 17],
    tags: ["mèo", "đồ chơi"]
  },
  {
    id: 7,
    name: "Thức ăn mèo cao cấp - 1kg",
    category: "cat",
    subcategory: "food",
    price: 250000,
    image: "cat-food.svg",
    description: "Thức ăn mèo dinh dưỡng, an toàn, vị ngon",
    relatedProducts: [6, 1, 13],
    tags: ["mèo", "thức ăn", "dinh dưỡng"]
  },
  {
    id: 17,
    name: "Ngói cạo móng mèo",
    category: "cat",
    subcategory: "toys",
    price: 75000,
    image: "cat-scratcher.svg",
    description: "Ngói cạo móng cho mèo, bảo vệ nội thất",
    relatedProducts: [4, 3],
    tags: ["mèo", "đồ chơi", "cạo móng"]
  },
  {
    id: 18,
    name: "Snack mèo - Cá hồi",
    category: "cat",
    subcategory: "food",
    price: 65000,
    image: "cat-snack.svg",
    description: "Snack mèo vị cá hồi, giàu omega-3",
    relatedProducts: [7, 13],
    tags: ["mèo", "thức ăn", "snack"]
  },

  // Dog Products - Leash & Collars
  {
    id: 8,
    name: "Dây dắt chó cao cấp - 2m",
    category: "dog",
    subcategory: "leash",
    price: 180000,
    image: "dog-leash.svg",
    description: "Dây dắt chó bền, thoải mái, an toàn, có độ co giãn",
    relatedProducts: [9, 10],
    tags: ["chó", "dây dắt", "an toàn"]
  },
  {
    id: 19,
    name: "Dây dắt tự động - 5m",
    category: "dog",
    subcategory: "leash",
    price: 220000,
    image: "dog-leash-auto.svg",
    description: "Dây dắt tự động, tiện lợi khi dạo phố",
    relatedProducts: [8, 9],
    tags: ["chó", "dây dắt", "tự động"]
  },
  {
    id: 20,
    name: "Cổ chó đeo - Phản quang",
    category: "dog",
    subcategory: "leash",
    price: 95000,
    image: "dog-collar.svg",
    description: "Cổ chó phản quang, an toàn ban đêm",
    relatedProducts: [8, 19],
    tags: ["chó", "cổ", "an toàn"]
  },

  // Dog Products - Food & Bedding
  {
    id: 9,
    name: "Thức ăn chó cao cấp - 2kg",
    category: "dog",
    subcategory: "food",
    price: 300000,
    image: "dog-food.svg",
    description: "Thức ăn chó dinh dưỡng, hỗ trợ sức khỏe, lông bóng",
    relatedProducts: [6, 8, 10, 13],
    tags: ["chó", "thức ăn", "dinh dưỡng"]
  },
  {
    id: 10,
    name: "Ghế nằm chó - XL",
    category: "dog",
    subcategory: "bedding",
    price: 400000,
    image: "dog-bed.svg",
    description: "Ghế nằm chó thoải mái, giặt được, chống thấm",
    relatedProducts: [8, 9, 21],
    tags: ["chó", "ghế nằm", "thoải mái"]
  },
  {
    id: 21,
    name: "Nhà chó di động",
    category: "dog",
    subcategory: "housing",
    price: 650000,
    image: "dog-house.svg",
    description: "Nhà chó di động, gấp gọn, dễ vận chuyển",
    relatedProducts: [10, 9],
    tags: ["chó", "nhà ở", "di động"]
  },
  {
    id: 22,
    name: "Snack chó - Người bạn",
    category: "dog",
    subcategory: "food",
    price: 85000,
    image: "dog-snack.svg",
    description: "Snack bò khô cao cấp cho chó",
    relatedProducts: [9, 13],
    tags: ["chó", "thức ăn", "snack"]
  },

  // General Products - Grooming
  {
    id: 11,
    name: "Chuốt lông chó mèo - Pro",
    category: "general",
    subcategory: "grooming",
    price: 120000,
    image: "brush.svg",
    description: "Chuốt lông cao cấp, dễ sử dụng, hiệu quả",
    relatedProducts: [12, 13],
    tags: ["chăm sóc", "lông", "mèo", "chó"]
  },
  {
    id: 12,
    name: "Dầu gội đặc biệt - Mềm mại",
    category: "general",
    subcategory: "grooming",
    price: 200000,
    image: "shampoo.svg",
    description: "Dầu gội chuyên dụng cho thú cưng, không hại",
    relatedProducts: [11, 13, 23],
    tags: ["chăm sóc", "dầu gội", "sạch sẽ"]
  },
  {
    id: 23,
    name: "Dầu xả cho thú cưng",
    category: "general",
    subcategory: "grooming",
    price: 180000,
    image: "conditioner.svg",
    description: "Dầu xả mềm mại, bảo vệ lông",
    relatedProducts: [12, 11],
    tags: ["chăm sóc", "dầu xả", "lông"]
  },
  {
    id: 24,
    name: "Kéo cắt lông thú cưng",
    category: "general",
    subcategory: "grooming",
    price: 280000,
    image: "scissors.svg",
    description: "Kéo cắt lông chuyên nghiệp, lưỡi sắc",
    relatedProducts: [11, 12],
    tags: ["chăm sóc", "cắt lông"]
  },

  // General Products - Water & Health
  {
    id: 6,
    name: "Máy uống nước tự động - USB",
    category: "general",
    subcategory: "water",
    price: 300000,
    image: "water-fountain.svg",
    description: "Máy uống nước tự động, giữ nước sạch, sạc USB",
    relatedProducts: [1, 7, 9],
    tags: ["uống nước", "tự động", "sạch", "mèo", "chó"]
  },
  {
    id: 13,
    name: "Vitamin cho thú cưng - Hộp",
    category: "general",
    subcategory: "supplement",
    price: 250000,
    image: "vitamin.svg",
    description: "Vitamin tổng hợp cho sức khỏe thú cưng",
    relatedProducts: [7, 9, 12],
    tags: ["vitamin", "sức khỏe", "dinh dưỡng"]
  },
  {
    id: 25,
    name: "Bàn chải đánh răng thú cưng",
    category: "general",
    subcategory: "grooming",
    price: 115000,
    image: "toothbrush.svg",
    description: "Bàn chải đánh răng cho thú cưng, bảo vệ răng",
    relatedProducts: [13, 12],
    tags: ["chăm sóc", "răng", "sức khỏe"]
  },
  {
    id: 26,
    name: "Chỉ nha khoa thú cưng",
    category: "general",
    subcategory: "grooming",
    price: 95000,
    image: "dental-floss.svg",
    description: "Chỉ nha khoa an toàn cho thú cưng",
    relatedProducts: [25, 13],
    tags: ["chăm sóc", "răng", "sức khỏe"]
  },

  // General Products - Accessories & Play
  {
    id: 27,
    name: "Bộ đồ chơi bóng mèo - 6 cái",
    category: "general",
    subcategory: "toys",
    price: 60000,
    image: "balls.svg",
    description: "Bộ 6 quả bóng đồ chơi cho thú cưng",
    relatedProducts: [4, 17],
    tags: ["đồ chơi", "bóng", "vui"]
  },
  {
    id: 28,
    name: "Bồn tắm dạo phố",
    category: "general",
    subcategory: "housing",
    price: 320000,
    image: "portable-tray.svg",
    description: "Bồn tắm dạo phố, gấp gọn, chống thấm",
    relatedProducts: [12, 23],
    tags: ["chăm sóc", "tắm", "di động"]
  },
  {
    id: 29,
    name: "Khay ăn inox cho thú cưng",
    category: "general",
    subcategory: "accessories",
    price: 85000,
    image: "bowl.svg",
    description: "Khay ăn inox vệ sinh, bền, an toàn",
    relatedProducts: [7, 9, 6],
    tags: ["ăn uống", "khay", "inox"]
  },
  {
    id: 30,
    name: "Vòng chuông cho thú cưng",
    category: "general",
    subcategory: "accessories",
    price: 45000,
    image: "bell.svg",
    description: "Vòng chuông an toàn, giúp theo dõi thú cưng",
    relatedProducts: [20, 8],
    tags: ["phụ kiện", "chuông", "an toàn"]
  },
  {
    id: 31,
    name: "Balo chó mèo cao cấp",
    category: "general",
    subcategory: "accessories",
    price: 450000,
    image: "backpack.svg",
    description: "Balo đựng thú cưng, thoáng khí, thoải mái",
    relatedProducts: [21, 10],
    tags: ["phụ kiện", "balo", "du lịch"]
  },
  {
    id: 32,
    name: "Quần áo thú cưng - Nhiều size",
    category: "general",
    subcategory: "accessories",
    price: 150000,
    image: "clothes.svg",
    description: "Quần áo thú cưng, giữ ấm, thoáng khí",
    relatedProducts: [5, 10],
    tags: ["phụ kiện", "quần áo", "thời trang"]
  },
  {
    id: 33,
    name: "Tấm lót cho thú cưng - 50 cái",
    category: "general",
    subcategory: "accessories",
    price: 120000,
    image: "pads.svg",
    description: "Tấm lót vệ sinh cho thú cưng, dễ vứt",
    relatedProducts: [1, 2],
    tags: ["vệ sinh", "tấm lót", "tiện"]
  },
  {
    id: 34,
    name: "Xe kéo thú cưng - Gấp được",
    category: "general",
    subcategory: "accessories",
    price: 580000,
    image: "stroller.svg",
    description: "Xe kéo thú cưng, gấp gọn, dễ đẩy",
    relatedProducts: [31, 21],
    tags: ["phụ kiện", "xe kéo", "du lịch"]
  },
  {
    id: 35,
    name: "Rương chứa đồ thú cưng",
    category: "general",
    subcategory: "accessories",
    price: 380000,
    image: "storage-box.svg",
    description: "Rương chứa đồ thú cưng, gọn gàng, sạch sẽ",
    relatedProducts: [4, 27],
    tags: ["phụ kiện", "lưu trữ", "tổ chức"]
  },
  {
    id: 36,
    name: "Đèn chiếu sáng thú cưng",
    category: "general",
    subcategory: "accessories",
    price: 200000,
    image: "light.svg",
    description: "Đèn chiếu sáng LED an toàn cho thú cưng",
    relatedProducts: [3, 10],
    tags: ["phụ kiện", "đèn", "sáng"]
  },
  {
    id: 37,
    name: "Máy quạt cho thú cưng",
    category: "general",
    subcategory: "accessories",
    price: 350000,
    image: "fan.svg",
    description: "Máy quạt mát cho thú cưng mùa hè",
    relatedProducts: [10, 5],
    tags: ["phụ kiện", "quạt", "mát"]
  },
  {
    id: 38,
    name: "Máy sưởi cho thú cưng",
    category: "general",
    subcategory: "accessories",
    price: 420000,
    image: "heater.svg",
    description: "Máy sưởi an toàn cho thú cưng mùa đông",
    relatedProducts: [5, 10],
    tags: ["phụ kiện", "sưởi", "ấm"]
  },
  {
    id: 39,
    name: "Tấm cách âm thú cưng",
    category: "general",
    subcategory: "accessories",
    price: 280000,
    image: "soundproof.svg",
    description: "Tấm cách âm để giảm tiếng ồn",
    relatedProducts: [3, 10],
    tags: ["phụ kiện", "cách âm", "yên tĩnh"]
  },
  {
    id: 40,
    name: "Toilet tấm lót thú cưng - 100 miếng",
    category: "general",
    subcategory: "accessories",
    price: 150000,
    image: "toilet-pads.svg",
    description: "Tấm lót toilet cho chó mèo, chất lượng cao",
    relatedProducts: [2, 1],
    tags: ["vệ sinh", "tấm lót", "toilet"]
  }
];

const chatbotResponses = {
  greetings: [
    "Xin chào! Tôi là trợ lý mua sắm thú cưng. Tôi có thể giúp bạn tìm sản phẩm phù hợp không?",
    "Chào bạn! Bạn cần tìm gì cho thú cưng của mình hôm nay?"
  ],
  help: [
    "Tôi có thể giúp bạn:\n- Tìm sản phẩm cho mèo hoặc chó\n- Nhận gợi ý sản phẩm liên quan\n- Tìm kiếm bằng hình ảnh hoặc giọng nói\n- Trả lời câu hỏi về chăm sóc thú cưng"
  ],
  recommendation_litter: "Bạn đang chọn cát vệ sinh! Để giữ vệ sinh tốt hơn, tôi xin gợi ý máy uống nước tự động hoặc bồn vệ sinh cao cấp.",
  recommendation_food: "Bạn đang chọn thức ăn! Máy uống nước tự động sẽ rất hữu ích để thú cưng của bạn luôn có nước sạch sẽ.",
  recommendation_toilet: "Bồn vệ sinh là tuyệt vời! Hãy kết hợp với cát vệ sinh cao cấp để có hiệu quả tốt nhất."
};

module.exports = {
  products,
  chatbotResponses
};
