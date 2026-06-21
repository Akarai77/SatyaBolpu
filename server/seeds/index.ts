import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import { User } from '../models/User.js';
import { Tag } from '../models/Tag.js';
import { PostType } from '../models/PostType.js';
import { PostGroup } from '../models/PostGroup.js';
import { Location } from '../models/Location.js';
import { Culture } from '../models/Culture.js';
import { Post } from '../models/Post.js';
import { Event } from '../models/Event.js';
import { connectDB } from '../utils/db.js';

dotenv.config();
connectDB();

const clearDatabase = async () => {
  console.log('\n🧹 Clearing database...');
  try {
    await User.deleteMany({});
    await Tag.deleteMany({});
    await PostType.deleteMany({});
    await PostGroup.deleteMany({});
    await Location.deleteMany({});
    await Culture.deleteMany({});
    await Post.deleteMany({});
    await Event.deleteMany({});
    console.log('✓ Database cleared');
  } catch (error) {
    console.error('✗ Error clearing database:', error);
  }
};

const seedData = async () => {
  try {
    console.log('\n👤 Creating user...');
    const hashedPassword = await bcryptjs.hash('123456', 10);
    const user = await User.create({
      name: 'Administrator',
      uname: '@admin@',
      email: 'admin@admin.com',
      phone: {
        dialCode: 91,
        number: 9876543210,
      },
      image: '/assets/profile.png',
      role: 'admin',
      verified: true,
      password: hashedPassword,
    });
    console.log(`✓ User created: ${user._id}`);
    const userId = user._id;

    console.log('\n🏷️  Creating tags...');
    const tagNames = ['Heritage', 'Festival', 'Tradition', 'Culture', 'Art'];
    const tags = await Tag.insertMany(tagNames.map((name) => ({ name })));
    console.log(`✓ Created ${tags.length} tags`);
    const tagIds = tags.map((t) => t._id);

    console.log('\n📝 Creating post types...');
    const postTypeNames = [
      'Article',
      'Story',
      'Guide',
      'Interview',
      'Documentary',
    ];
    const postTypes = await PostType.insertMany(
      postTypeNames.map((name) => ({ name })),
    );
    console.log(`✓ Created ${postTypes.length} post types`);
    const postTypeIds = postTypes.map((pt) => pt._id);

    console.log('\n📚 Creating post groups...');
    const postGroupNames = [
      'Travel Guide',
      'Local Stories',
      'Art & Craft',
      'Food & Cuisine',
      'Historical Events',
    ];
    const postGroups = await PostGroup.insertMany(
      postGroupNames.map((name) => ({ name, postCount: 0 })),
    );
    console.log(`✓ Created ${postGroups.length} post groups`);
    const postGroupIds = postGroups.map((pg) => pg._id);

    console.log('\n📍 Creating locations...');
    const locations = await Location.insertMany([
      {
        userId,
        type: 'Point',
        name: 'Udupi Beach',
        coordinates: [74.7421, 13.3409],
        district: 'Udupi',
        taluk: 'Udupi',
        village: 'Udupi',
        attachments: [],
      },
      {
        userId,
        type: 'Point',
        name: 'Kundapura Temple',
        coordinates: [74.7065, 13.5272],
        district: 'Udupi',
        taluk: 'Kundapura',
        village: 'Kundapura',
        attachments: [],
      },
      {
        userId,
        type: 'Point',
        name: 'Barkur Fort',
        coordinates: [75.1167, 13.5],
        district: 'Udupi',
        taluk: 'Barkur',
        village: 'Barkur',
        attachments: [],
      },
      {
        userId,
        type: 'Point',
        name: 'Malpe Beach',
        coordinates: [74.7639, 13.3292],
        district: 'Udupi',
        taluk: 'Malpe',
        village: 'Malpe',
        attachments: [],
      },
      {
        userId,
        type: 'Point',
        name: 'Jomlu Bazaar',
        coordinates: [74.7572, 13.3377],
        district: 'Udupi',
        taluk: 'Udupi',
        village: 'Jomlu',
        attachments: [],
      },
    ]);
    console.log(`✓ Created ${locations.length} locations`);
    const locationIds = locations.map((l) => l._id);

    console.log('\n🎭 Creating cultures...');
    const cultures = await Culture.insertMany([
      {
        userId,
        title: 'Daivaradhane',
        description:
          'Sacred ritual worship of ancestral and protective deities in Tulunadu tradition.',
        coverImage: '/assets/cultures/daivaradhane/coverImage.jpg',
        galleryImages: [
          '/assets/cultures/daivaradhane/galleryImage1.jpg',
          '/assets/cultures/daivaradhane/galleryImage2.jpg',
          '/assets/cultures/daivaradhane/galleryImage3.jpg',
          '/assets/cultures/daivaradhane/galleryImage4.jpg',
          '/assets/cultures/daivaradhane/galleryImage5.jpg',
          '/assets/cultures/daivaradhane/galleryImage6.jpg',
          '/assets/cultures/daivaradhane/galleryImage7.jpg',
          '/assets/cultures/daivaradhane/galleryImage8.jpg',
          '/assets/cultures/daivaradhane/galleryImage9.jpg',
          '/assets/cultures/daivaradhane/galleryImage10.jpg',
          '/assets/cultures/daivaradhane/galleryImage11.jpg',
          '/assets/cultures/daivaradhane/galleryImage12.jpg',
          '/assets/cultures/daivaradhane/galleryImage13.jpg',
          '/assets/cultures/daivaradhane/galleryImage14.jpg',
          '/assets/cultures/daivaradhane/galleryImage15.jpg',
        ],
        content:
          'Daivaradhane is a sacred ritual worship performed in households and temples across Tulunadu, where families pay homage to their ancestral and protective deities. This centuries-old tradition involves elaborate ceremonies, offerings, and community gatherings that strengthen the spiritual bonds between families and their divine protectors. The ritual serves as a cornerstone of cultural identity, passed down through generations, and represents the deep spiritual connection that Tulu people maintain with their heritage and belief systems.',
      },
      {
        userId,
        title: 'Nagaradhane',
        description:
          'Traditional serpent worship ceremony honoring the sacred connection with nature.',
        coverImage: '/assets/cultures/nagaradhane/coverImage.jpg',
        galleryImages: [
          '/assets/cultures/nagaradhane/galleryImage1.jpg',
          '/assets/cultures/nagaradhane/galleryImage2.jpg',
          '/assets/cultures/nagaradhane/galleryImage3.jpg',
          '/assets/cultures/nagaradhane/galleryImage4.jpg',
          '/assets/cultures/nagaradhane/galleryImage5.jpg',
          '/assets/cultures/nagaradhane/galleryImage6.jpg',
          '/assets/cultures/nagaradhane/galleryImage7.jpg',
          '/assets/cultures/nagaradhane/galleryImage8.jpg',
          '/assets/cultures/nagaradhane/galleryImage9.jpg',
          '/assets/cultures/nagaradhane/galleryImage10.jpg',
          '/assets/cultures/nagaradhane/galleryImage11.jpg',
          '/assets/cultures/nagaradhane/galleryImage12.jpg',
          '/assets/cultures/nagaradhane/galleryImage13.jpg',
          '/assets/cultures/nagaradhane/galleryImage14.jpg',
          '/assets/cultures/nagaradhane/galleryImage15.jpg',
        ],
        content:
          'Nagaradhane is a beautiful ritual dedicated to the worship of serpents, reflecting the ancient ecological wisdom of Tulunadu people who recognized the vital role snakes play in maintaining natural balance. This ceremony celebrates the serpent as a symbol of fertility, wisdom, and protection, deeply rooted in Hindu mythology and Tulu cosmology. Performed annually, typically during spring, Nagaradhane brings communities together to express gratitude to nature and seek blessings for prosperity and well-being through sacred offerings and traditional chants.',
      },
      {
        userId,
        title: 'Yakshagana',
        description:
          'Classical night-long theatrical performance combining music, dance, and epic narratives.',
        coverImage: '/assets/cultures/yakshagana/coverImage.jpg',
        galleryImages: [
          '/assets/cultures/yakshagana/galleryImage1.jpg',
          '/assets/cultures/yakshagana/galleryImage2.jpg',
          '/assets/cultures/yakshagana/galleryImage3.jpg',
          '/assets/cultures/yakshagana/galleryImage4.jpg',
          '/assets/cultures/yakshagana/galleryImage5.jpg',
          '/assets/cultures/yakshagana/galleryImage6.jpg',
          '/assets/cultures/yakshagana/galleryImage7.jpg',
          '/assets/cultures/yakshagana/galleryImage8.jpg',
          '/assets/cultures/yakshagana/galleryImage9.jpg',
          '/assets/cultures/yakshagana/galleryImage10.jpg',
          '/assets/cultures/yakshagana/galleryImage11.jpg',
          '/assets/cultures/yakshagana/galleryImage12.jpg',
          '/assets/cultures/yakshagana/galleryImage13.jpg',
          '/assets/cultures/yakshagana/galleryImage14.jpg',
          '/assets/cultures/yakshagana/galleryImage15.jpg',
        ],
        content:
          'Yakshagana is a unique and vibrant classical art form native to Tulunadu, characterized by elaborate costumes, elaborate makeup, and dynamic performances that typically continue through the entire night. This theatrical tradition blends elaborate dance movements, classical music, and powerful narration to bring epic tales from Hindu mythology to life. Performers, who undergo rigorous training for years, embody different characters with distinctive costumes and gestures, while the orchestra provides rhythmic accompaniment. Yakshagana remains an essential expression of Tulu cultural pride and artistic excellence, attracting audiences from across the region.',
      },
      {
        userId,
        title: 'Kambala',
        description:
          'Traditional buffalo race festival showcasing agricultural heritage and community spirit.',
        coverImage: '/assets/cultures/kambala/coverImage.jpg',
        galleryImages: [
          '/assets/cultures/kambala/galleryImage1.jpg',
          '/assets/cultures/kambala/galleryImage2.jpg',
          '/assets/cultures/kambala/galleryImage3.jpg',
          '/assets/cultures/kambala/galleryImage4.jpg',
          '/assets/cultures/kambala/galleryImage5.jpg',
          '/assets/cultures/kambala/galleryImage6.jpg',
          '/assets/cultures/kambala/galleryImage7.jpg',
          '/assets/cultures/kambala/galleryImage8.jpg',
          '/assets/cultures/kambala/galleryImage9.jpg',
          '/assets/cultures/kambala/galleryImage10.jpg',
          '/assets/cultures/kambala/galleryImage11.jpg',
          '/assets/cultures/kambala/galleryImage12.jpg',
          '/assets/cultures/kambala/galleryImage13.jpg',
          '/assets/cultures/kambala/galleryImage14.jpg',
          '/assets/cultures/kambala/galleryImage15.jpg',
        ],
        content:
          "Kambala is an exciting and ancient buffalo race tradition that has been celebrated in Tulunadu for centuries, representing the region's strong agricultural roots and farming community. Young men, barefoot and energetic, race through muddy tracks while riding or guiding decorated water buffaloes, creating an exhilarating spectacle accompanied by enthusiastic crowds and traditional drumming. This spectacular festival celebrates human courage, animal welfare, and community bonds, bringing together farmers and spectators in a joyous celebration that combines sport, tradition, and cultural pride. Kambala remains a cherished symbol of Tulu heritage and rural life.",
      },
    ]);
    console.log(`✓ Created ${cultures.length} cultures`);
    const cultureIds = cultures.map((c) => c._id);

    console.log('\n📄 Creating posts...');
    const posts = await Post.insertMany([
      {
        userId,
        title: 'Origins of Daivaradhane',
        culture: cultureIds[0],
        postGroup: postGroupIds[0],
        postType: postTypeIds[0],
        description: 'Tracing the roots of Tulunadu’s sacred spirit worship.',
        tags: [tagIds[0], tagIds[1]],
        coverImage: '/assets/posts/post1.jpg',
        content: `
Daivaradhane is one of the oldest and most distinctive spiritual traditions of Tulunadu, deeply woven into the social and cultural fabric of the region. Unlike mainstream temple worship, Daivaradhane focuses on the reverence of Daivas, divine spirits believed to protect communities, villages, clans, and families. These spirits are considered guardians who watch over the people, maintain justice, and preserve harmony between humans, nature, and the spiritual world.

The origins of Daivaradhane can be traced back centuries before the establishment of large temple institutions in the region. Ancient communities living in the forests, coastal settlements, and agricultural lands of Tulunadu developed close relationships with natural forces and ancestral spirits. Over time, these beliefs evolved into an organized system of worship where specific Daivas became associated with particular families, occupations, villages, and social groups.

Many Daivas are believed to have once lived as extraordinary human beings who displayed exceptional courage, sacrifice, leadership, or devotion. After their death, they were elevated to divine status and became protectors of the people. Stories of legendary figures such as Panjurli, Bobbarya, Kalkuda, Kallurti, and Jumadi continue to be passed down through oral traditions, songs, and ritual performances. These narratives preserve not only spiritual teachings but also historical memories of the region.

Daivaradhane serves a unique role in Tulunadu society. Beyond spiritual worship, it functions as a cultural institution that reinforces community identity and social cohesion. Annual ceremonies bring together extended families, relatives, and entire villages, creating opportunities to strengthen relationships and preserve traditions. These gatherings often include ritual performances, communal meals, traditional music, and the recitation of ancient legends.

The tradition also reflects the democratic nature of Tulu spirituality. People from various backgrounds participate in ceremonies and seek guidance from the Daiva on matters ranging from family disputes to agricultural concerns. Through this interaction, Daivaradhane continues to remain a living tradition that adapts to changing times while preserving its ancient foundations.

Today, despite rapid modernization, Daivaradhane remains an integral part of life in Tulunadu. The ceremonies continue to attract younger generations who seek to reconnect with their heritage and understand the values that have shaped their communities for centuries.
        `,
      },

      {
        userId,
        title: 'Role of the Patri in Daivaradhane',
        culture: cultureIds[0],
        postGroup: postGroupIds[0],
        postType: postTypeIds[1],
        description: 'Understanding the medium through whom the daiva speaks.',
        tags: [tagIds[0]],
        coverImage: '/assets/posts/post2.jpg',
        content: `
The Patri occupies one of the most respected and spiritually significant positions within the tradition of Daivaradhane. Serving as the human medium through whom the Daiva communicates with devotees, the Patri acts as a bridge connecting the physical and spiritual realms. His role extends far beyond ceremonial participation, requiring discipline, devotion, and a profound understanding of sacred traditions.

Preparation for becoming a Patri often begins years before active participation in ceremonies. Individuals selected for this responsibility typically come from families with a long history of serving particular Daivas. They undergo rigorous training involving ritual practices, traditional customs, sacred songs, and community responsibilities. This preparation ensures that they can faithfully represent the Daiva and maintain the integrity of the tradition.

During ceremonies, the Patri undergoes elaborate ritual preparations that include fasting, purification rites, special attire, and prayers. As the performance progresses through music, drumming, chanting, and dance, the Patri gradually enters a trance-like state believed to facilitate divine possession. In this transformed state, devotees believe the Daiva speaks directly through the Patri, offering guidance, blessings, warnings, and judgments.

One of the most important responsibilities of the Patri is addressing concerns brought forward by community members. People seek advice regarding family matters, health issues, agricultural challenges, financial difficulties, and social disputes. The guidance delivered during these interactions is often regarded with deep respect and influences important decisions within families and villages.

The Patri also serves as a guardian of cultural knowledge. Through ritual performances, he helps preserve oral histories, myths, and traditional values that might otherwise be lost. Younger generations observe these ceremonies and learn about their heritage through the stories and teachings communicated during Daivaradhane.

Despite technological advancements and social change, the role of the Patri remains highly relevant. Many communities continue to view the Patri as both a spiritual guide and a cultural custodian whose presence helps maintain continuity between past and present generations.
        `,
      },

      {
        userId,
        title: 'Why Serpents Are Sacred in Nagaradhane',
        culture: cultureIds[1],
        postGroup: postGroupIds[1],
        postType: postTypeIds[0],
        description: 'Exploring the symbolism of serpent worship.',
        tags: [tagIds[2]],
        coverImage: '/assets/posts/post3.jpg',
        content: `
Nagaradhane, the ancient tradition of serpent worship in Tulunadu, reflects a profound relationship between humans and the natural world. At the heart of this practice lies the belief that serpents embody divine power, fertility, protection, wisdom, and ecological balance. These beliefs have shaped the spiritual identity of communities across the region for generations.

In Hindu mythology, serpents hold a special place among divine beings. Lord Vishnu rests upon the cosmic serpent Adishesha, while Lord Shiva adorns serpents as symbols of mastery over fear and death. These sacred associations influenced the development of serpent worship traditions throughout South India, including the unique practices observed in Tulunadu.

Beyond mythology, Nagaradhane reflects practical ecological wisdom. Historically, agricultural communities depended heavily on healthy ecosystems for survival. Snakes helped control rodent populations that threatened crops and food storage. Recognizing their importance, communities developed rituals that encouraged respect and protection for serpent habitats rather than fear or destruction.

The symbolism of serpents extends to fertility and prosperity. Their ability to shed skin and emerge renewed made them powerful representations of regeneration, transformation, and continuity of life. Families often perform Nagaradhane ceremonies seeking blessings for health, prosperity, successful harvests, and the well-being of future generations.

Sacred serpent shrines known as Nagarakattes can be found throughout the region. These shrines serve as focal points for worship and often exist within preserved natural spaces that support local biodiversity. Ritual offerings, prayers, and annual ceremonies reinforce the connection between spirituality and environmental stewardship.

Today, Nagaradhane continues to inspire respect for nature while preserving cultural traditions. The practice reminds communities that human well-being is closely tied to ecological balance and that protecting the natural world is both a spiritual and practical responsibility.
          `,
      },

      {
        userId,
        title: 'Sacred Groves and Nagarakattes',
        culture: cultureIds[1],
        postGroup: postGroupIds[1],
        postType: postTypeIds[1],
        description: 'The importance of serpent shrines in Tulunadu.',
        tags: [tagIds[2], tagIds[3]],
        coverImage: '/assets/posts/post4.jpg',
        content: `
Sacred groves, locally known as Nagabanas, and serpent shrines called Nagarakattes form the spiritual and ecological heart of Nagaradhane in Tulunadu. These sacred spaces represent far more than places of worship. They are living examples of how ancient communities integrated spirituality, environmental conservation, and social responsibility into a single cultural tradition.

A Nagabana is typically a small forested area preserved specifically for serpent worship. Unlike cultivated lands or managed gardens, these groves are intentionally left undisturbed. Trees, shrubs, vines, insects, birds, and reptiles coexist in a natural ecosystem protected by religious belief. For generations, local communities have considered these groves sacred and have prohibited activities such as tree cutting, hunting, or land clearing within their boundaries.

At the center of many sacred groves stands a Nagarakatte, a shrine dedicated to serpent deities. These shrines usually consist of stone serpent idols placed beneath ancient trees, often banyan, peepal, or jackfruit trees. The location itself is considered spiritually significant because serpents are believed to inhabit and protect these natural spaces. Devotees visit these shrines to offer prayers, flowers, milk, turmeric, and coconuts while seeking blessings for prosperity, fertility, and protection.

One of the most remarkable aspects of Nagabanas is their role in biodiversity conservation. Long before modern environmental science emerged, local communities recognized that preserving natural habitats benefited both people and wildlife. By associating these areas with sacred beliefs, communities created an effective system of environmental protection that endured for centuries. Many rare plant species, medicinal herbs, birds, and reptiles continue to survive within sacred groves because of these traditional practices.

Annual Nagaradhane ceremonies transform these quiet spaces into centers of communal activity. Families gather to clean the grove, perform rituals, share meals, and participate in cultural programs. These events strengthen social bonds while renewing collective commitment to preserving the sacred landscape. The ceremonies also provide opportunities for younger generations to learn about their cultural heritage and environmental responsibilities.

The symbolism of sacred groves extends beyond ecological conservation. They represent the belief that humans are not separate from nature but are part of a larger interconnected system. By protecting serpent habitats, communities acknowledge their dependence on ecological balance and demonstrate respect for all forms of life.

In modern times, urbanization and land development have threatened many traditional sacred groves. Nevertheless, numerous communities continue to safeguard these spaces despite increasing economic pressures. Conservationists often cite Nagabanas as examples of successful community-led environmental protection because they combine cultural values with practical ecological benefits.

Today, sacred groves and Nagarakattes remain powerful reminders of a worldview that values harmony between spirituality and nature. They demonstrate how ancient traditions can provide meaningful solutions to contemporary environmental challenges while preserving cultural identity and community cohesion.
          `,
      },

      {
        userId,
        title: 'The Making of a Yakshagana Artist',
        culture: cultureIds[2],
        postGroup: postGroupIds[2],
        postType: postTypeIds[0],
        description: 'Training and discipline behind the art form.',
        tags: [tagIds[4]],
        coverImage: '/assets/posts/post5.jpg',
        content: `
Yakshagana is one of India's most visually stunning and intellectually demanding performance traditions. Behind every captivating performance lies years of dedication, discipline, and rigorous training. Becoming a Yakshagana artist is not simply a matter of learning dance or memorizing dialogue. It requires mastery of multiple artistic disciplines and a deep understanding of mythology, music, expression, and storytelling.

The journey often begins at a young age. Many aspiring performers grow up in families with strong connections to Yakshagana and are introduced to the art form through local performances and cultural programs. Early exposure helps cultivate appreciation for the tradition and inspires children to pursue formal training.

Training typically begins with physical conditioning. Yakshagana performances demand extraordinary stamina because shows often continue throughout the night. Artists must perform energetic dances, maintain dramatic expressions, and deliver powerful dialogues while wearing heavy costumes and elaborate headgear. Daily exercises help develop strength, flexibility, balance, and endurance necessary for these demanding performances.

Dance training forms another essential component of preparation. Students learn traditional footwork patterns, body movements, gestures, and character-specific techniques. Every movement carries meaning and contributes to storytelling. Heroes, villains, kings, sages, and divine beings each possess distinctive styles that performers must master.

Musical education is equally important. Artists learn rhythm patterns, vocal techniques, and the structure of traditional compositions. Understanding music allows performers to synchronize their movements with the orchestra and respond effectively to changes in tempo and mood during live performances.

Perhaps the most challenging aspect of training involves mastering dialogue delivery. Yakshagana performances often feature lengthy improvisational exchanges between characters. Artists must memorize mythological narratives while developing the ability to think creatively and respond spontaneously during performances. This combination of preparation and improvisation gives Yakshagana its unique dynamic quality.

Costume and makeup preparation also require specialized knowledge. Artists spend hours transforming themselves into larger-than-life characters. Learning how costumes, ornaments, and facial designs contribute to characterization helps performers fully embody their roles and communicate effectively with audiences.

Beyond technical skills, Yakshagana training emphasizes discipline, humility, and respect for tradition. Students learn the cultural significance of the art form and their responsibility to preserve and transmit knowledge to future generations. Senior artists often serve as mentors, sharing insights gained through decades of experience.

The result of this comprehensive training is a performer capable of transporting audiences into the world of epic mythology. Through music, dance, dialogue, and visual spectacle, Yakshagana artists bring ancient stories to life while preserving one of Tulunadu's most treasured cultural traditions.
          `,
      },

      {
        userId,
        title: 'Decoding Yakshagana Costumes',
        culture: cultureIds[2],
        postGroup: postGroupIds[2],
        postType: postTypeIds[1],
        description: 'How costume design brings characters to life.',
        tags: [tagIds[4]],
        coverImage: '/assets/posts/post6.jpg',
        content: `
One of the first things that captivates audiences during a Yakshagana performance is the breathtaking visual appearance of the performers. The elaborate costumes, towering headgear, intricate ornaments, and dramatic makeup create an atmosphere unlike any other theatrical tradition. Every element serves a specific purpose and contributes to the storytelling process.

Yakshagana costumes are designed to transform ordinary performers into extraordinary mythological characters. Heroes appear majestic and noble, villains project power and intimidation, divine beings radiate spiritual authority, and sages embody wisdom and serenity. Through costume design alone, audiences can often identify a character's role before a single word is spoken.

The most striking feature is the headgear, known as Kirita. These elaborate structures vary significantly depending on the character being portrayed. Kings and divine heroes wear large, ornate crowns symbolizing authority and power. Demonic characters often feature more aggressive and imposing designs intended to evoke fear and awe.

Facial makeup plays an equally important role. Different color schemes communicate distinct personality traits and moral qualities. Bright and balanced colors typically represent virtuous characters, while darker and more intense designs are associated with antagonists. Makeup artists spend hours applying intricate patterns that enhance facial expressions and increase visibility for large audiences.

Ornaments and jewelry further reinforce characterization. Necklaces, armlets, waistbands, and decorative accessories add visual richness while symbolizing social status, divine power, or heroic achievement. The weight and complexity of these ornaments require performers to develop significant physical strength and endurance.

Costume colors also carry symbolic meaning. Red often represents courage and energy. Gold signifies royalty and divinity. Black may indicate mystery, power, or destructive forces. White frequently symbolizes purity, wisdom, and spiritual discipline. These visual cues help audiences quickly understand character relationships and narrative dynamics.

The construction of Yakshagana costumes reflects centuries of artistic refinement. Skilled craftsmen use traditional techniques passed down through generations to create durable and visually impressive garments. Many costume elements are handmade and require extensive labor, making them valuable cultural artifacts in their own right.

Beyond aesthetics, costumes contribute to performance technique. The exaggerated proportions encourage performers to adopt larger-than-life movements and gestures suitable for mythological storytelling. Every step, turn, and pose becomes more dramatic and impactful when enhanced by the costume's visual presence.

Together, costumes, makeup, and ornaments transform Yakshagana into a complete visual spectacle. They demonstrate how artistic design can communicate complex ideas, enrich storytelling, and preserve cultural heritage across generations.
          `,
      },

      {
        userId,
        title: 'History of Kambala',
        culture: cultureIds[3],
        postGroup: postGroupIds[3],
        postType: postTypeIds[0],
        description: 'The agricultural origins of buffalo racing.',
        tags: [tagIds[1]],
        coverImage: '/assets/posts/post7.jpg',
        content: `
Kambala is one of the most iconic cultural traditions of Tulunadu, celebrated for its thrilling buffalo races and deep connection to agricultural life. Although modern audiences often view Kambala as a sporting event, its origins are rooted in farming practices, religious beliefs, and community celebrations that developed over many centuries.

Historically, agriculture formed the foundation of life in Tulunadu. Rice cultivation dominated the region's economy, and water buffaloes played an essential role in preparing fields for planting. Farmers depended heavily on these powerful animals for plowing, transportation, and other agricultural activities. Over time, communities began organizing races that showcased the strength, speed, and training of their buffaloes.

Early Kambala events were closely linked to harvest celebrations and religious observances. Farmers organized races as expressions of gratitude for successful harvests and sought blessings for future prosperity. These gatherings brought together neighboring villages and created opportunities for social interaction, cultural exchange, and friendly competition.

The races traditionally take place on specially prepared muddy tracks filled with water. Participants guide pairs of buffaloes through the track at remarkable speeds while maintaining balance and control. Success depends not only on the strength of the animals but also on the skill, coordination, and courage of the runner.

Throughout history, local rulers and wealthy landowners often sponsored Kambala events, enhancing their prestige and popularity. Competitive rivalries emerged between villages and families, encouraging improvements in buffalo breeding, training, and race organization. These developments gradually transformed Kambala into a highly anticipated regional festival.

Despite colonial influences and modernization, Kambala survived because of its deep cultural significance. Communities viewed the tradition as an expression of regional identity and agricultural heritage. Generations of organizers, participants, and supporters worked to preserve the event even during periods of social and economic change.

In recent decades, Kambala has gained wider recognition beyond Tulunadu. Media coverage and public interest have introduced the tradition to audiences across India and abroad. At the same time, organizers have implemented regulations and welfare measures to ensure the safety and well-being of participating animals.

Today, Kambala remains a vibrant celebration of history, culture, and community spirit. It honors the agricultural roots of Tulunadu while continuing to inspire pride among people who recognize the importance of preserving traditional practices in a rapidly changing world.
          `,
      },

      {
        userId,
        title: 'Preparing Buffaloes for Kambala',
        culture: cultureIds[3],
        postGroup: postGroupIds[3],
        postType: postTypeIds[1],
        description: 'Behind the scenes of a Kambala season.',
        tags: [tagIds[1], tagIds[3]],
        coverImage: '/assets/posts/post8.jpg',
        content: `
Behind every successful Kambala race stands months, and often years, of careful preparation. The buffaloes that compete in these prestigious events are not ordinary working animals. They are highly valued members of their owners' families and receive exceptional care designed to maximize health, strength, and performance.

Preparation begins with selection. Owners carefully choose buffaloes based on physical characteristics such as strength, stamina, body structure, and temperament. Animals displaying natural athletic ability are often trained specifically for racing from an early age.

Nutrition plays a crucial role in conditioning. Kambala buffaloes receive specially designed diets rich in nutrients necessary for muscle development and sustained energy. Their meals may include rice, coconut, jaggery, green fodder, and various traditional supplements. Owners monitor feeding schedules carefully to ensure optimal health and performance.

Exercise and training form the core of preparation. Buffaloes undergo regular workouts that gradually build endurance and speed. Training sessions often include running through shallow water, strengthening exercises, and practice races that simulate competition conditions. These routines help animals develop the physical fitness required for demanding race environments.

Equally important is the bond between buffalo and trainer. Successful racing depends on trust, communication, and mutual understanding. Trainers spend significant time with their animals, learning individual behaviors and developing techniques that encourage peak performance. Many owners describe their buffaloes as family members rather than livestock.

Health care receives meticulous attention throughout the year. Veterinarians conduct regular examinations to monitor physical condition and prevent injuries. Owners invest considerable resources in maintaining animal welfare because healthy buffaloes are essential both for competition success and ethical responsibility.

As race day approaches, preparation becomes even more intensive. Grooming routines ensure that animals look their best while remaining comfortable. Decorative ornaments and ceremonial accessories are often added to celebrate the cultural significance of the event. Communities gather to admire the buffaloes and appreciate the dedication invested in their care.

The preparation process reflects values that extend beyond competition. It demonstrates respect for animals, commitment to excellence, and pride in cultural heritage. Through their efforts, owners preserve traditions that have connected generations of farmers and communities across Tulunadu.

When buffaloes finally enter the muddy track, spectators witness more than a race. They see the culmination of months of hard work, centuries of tradition, and the enduring relationship between humans, animals, and the agricultural heritage that continues to define Kambala today. 🐃🏁
          `,
      },
    ]);
    console.log(`✓ Created ${posts.length} posts`);

    console.log('\n📅 Creating events...');
    const now = new Date();
    const events = await Event.insertMany([
      {
        userId,
        title: 'Annual Daivaradhane Mahothsava',
        description:
          'A grand community gathering featuring Daiva kola performances, offerings, blessings, and traditional rituals dedicated to ancestral and protective deities.',
        culture: cultureIds[0],
        duration: {
          start: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          end: new Date(now.getTime() + 32 * 24 * 60 * 60 * 1000),
        },
        coverImage: '/assets/events/event1.jpg',
        location: locationIds[0],
      },

      {
        userId,
        title: 'Panjurli Daiva Kola Night',
        description:
          'Experience a traditional all-night Daiva Kola ceremony where the spirit medium performs sacred rituals and delivers blessings to devotees.',
        culture: cultureIds[0],
        duration: {
          start: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
          end: new Date(
            now.getTime() + 45 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000,
          ),
        },
        coverImage: '/assets/events/event2.jpg',
        location: locationIds[1],
      },

      {
        userId,
        title: 'Nagaradhane Annual Pooja',
        description:
          'Traditional serpent worship ceremony featuring offerings, prayers, and rituals seeking blessings for prosperity and environmental harmony.',
        culture: cultureIds[1],
        duration: {
          start: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
          end: new Date(
            now.getTime() + 60 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000,
          ),
        },
        coverImage: '/assets/events/event3.jpg',
        location: locationIds[2],
      },

      {
        userId,
        title: 'Sacred Grove Conservation Day',
        description:
          'Community event focused on preserving Nagabanas and promoting awareness about the ecological importance of sacred serpent groves.',
        culture: cultureIds[1],
        duration: {
          start: new Date(now.getTime() + 75 * 24 * 60 * 60 * 1000),
          end: new Date(
            now.getTime() + 75 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000,
          ),
        },
        coverImage: '/assets/events/event4.jpg',
        location: locationIds[3],
      },

      {
        userId,
        title: 'Yakshagana All-Night Performance',
        description:
          'A traditional overnight Yakshagana performance presenting stories from the Mahabharata through dance, music, and dramatic storytelling.',
        culture: cultureIds[2],
        duration: {
          start: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
          end: new Date(
            now.getTime() + 90 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000,
          ),
        },
        coverImage: '/assets/events/event5.jpg',
        location: locationIds[4],
      },

      {
        userId,
        title: 'Yakshagana Costume & Makeup Workshop',
        description:
          'Learn the intricate art of Yakshagana costume preparation, facial makeup, and character transformation from experienced artists.',
        culture: cultureIds[2],
        duration: {
          start: new Date(now.getTime() + 105 * 24 * 60 * 60 * 1000),
          end: new Date(
            now.getTime() + 105 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000,
          ),
        },
        coverImage: '/assets/events/event6.jpg',
        location: locationIds[0],
      },

      {
        userId,
        title: 'Kambala Championship',
        description:
          'A thrilling buffalo racing competition bringing together top Kambala teams from across Tulunadu.',
        culture: cultureIds[3],
        duration: {
          start: new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000),
          end: new Date(now.getTime() + 122 * 24 * 60 * 60 * 1000),
        },
        coverImage: '/assets/events/event7.jpg',
        location: locationIds[1],
      },

      {
        userId,
        title: 'Kambala Buffalo Training Exhibition',
        description:
          'A showcase demonstrating traditional buffalo training techniques, care practices, and preparation methods used for Kambala racing.',
        culture: cultureIds[3],
        duration: {
          start: new Date(now.getTime() + 135 * 24 * 60 * 60 * 1000),
          end: new Date(
            now.getTime() + 135 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000,
          ),
        },
        coverImage: '/assets/events/event8.jpg',
        location: locationIds[2],
      },
    ]);
    console.log(`✓ Created ${events.length} events`);

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: 1`);
    console.log(`   Tags: ${tags.length}`);
    console.log(`   Post Types: ${postTypes.length}`);
    console.log(`   Post Groups: ${postGroups.length}`);
    console.log(`   Locations: ${locations.length}`);
    console.log(`   Cultures: ${cultures.length}`);
    console.log(`   Posts: ${posts.length}`);
    console.log(`   Events: ${events.length}`);
    console.log('\n📝 User Details:');
    console.log(`   ID: ${userId}`);
    console.log(`   Email: akarsh@example.com`);
    console.log(`   Password: Password123`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

const main = async () => {
  await clearDatabase();
  await seedData();
  await mongoose.connection.close();
  console.log('\n🔌 Database connection closed');
};

main();
