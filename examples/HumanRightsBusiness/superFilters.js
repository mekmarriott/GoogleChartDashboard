var stackedValues = {
	'sector': {
		'Consumer products/retail': ['Battery', 'Ceramics', 'Cookware', 'Cosmetics', 'Bakeries', 'Baby product', 'Department stores', 'Electrical appliance', 'Match', 'Memorabilia/collectibles', 'Musical instrument', 'Newsagents', 'Luggage, backpacks & bags', 'Jewellery', 'Greeting card & gift-wrap', 'Handcrafts', 'Household products', 'Office equipment', 'Office supplies & stationery', 'Toiletries & soap', 'Toy', 'Watch & clock', 'Wholesale', 'Tableware', 'Supermarkets & grocery', 'Perfume', 'Photographic', 'Retail', 'Wigs'],
		'Commercial sex & pornography': ['Pornography', 'Prostitution & sex trafficking'],
		'Conglomerates': ['Diversified/Conglomerates'],
		'Construction & building materials': ['Road-building', 'Tool', 'Welding', 'Insulation', 'Heating & boilers', 'Construction', 'Construction machinery & vehicles', 'Dam-building', 'Flooring', 'Cement', 'Building materials & equipment', 'Air conditioning', 'Asbestos', 'Brick'],
		'Leisure': ['Amusement park', 'Boat & yacht', 'Entertainment', 'Restaurants & bars', 'Nightclubs', 'Fireworks', 'GamblingLottery'],
		'Health': ['Pharmaceutical', 'Pharmacies', 'Medical equipment/supplies', 'Health care', 'Biotechnology', 'Drug-testing'],
		'Manufacturing': ['Machine & machine tools', 'Manufacturing: General'],
		'Media/publishing': ['Media & publishing: General'],
		'Finance': ['Finance & banking', 'Insurance', 'Stock exchanges'],
		'Garden/landscaping': ['Gardening & landscaping', 'Garden supply'],
		'Furnishings': ['Furniture', 'Lighting & light bulb', 'Wallpaper', 'Carpet & rug'],
		'Chemical': ['Refrigerant', 'Pesticide', 'Fertiliser', 'Industrial gases', 'Ink', 'Paint', 'Ethanol', 'Dye', 'Adhesives & glue', 'Chemical: General', 'Cleaning products'],
		'Apparel & textile': ['Leather & tanneries', 'Footwear', 'Clothing & textile'],
		'Agriculture/food/beverage/tobacco/fishing': ['Palm trees & oil', 'Salt', 'Slaughterhouses', 'Sugar', 'Food & beverage', 'Flower', 'Canneries', 'Chocolate & cocoa', 'Coffee', 'Fishing', 'Tea', 'Tobacco', 'Wineries', 'Candy', 'Biofuels', 'Agricultural machinery', 'Agriculture & livestock', 'Baby food & baby milk'],
		'Metals/plastics/basic materials': ['Soda ash', 'Rubber', 'Plastics', 'Fiberglass', 'Foam', 'Glass', 'Metals & steel'],
		'Utilities': ['Water companies', 'Energy', 'Nuclear energy', 'Waste disposal'],
		'Safety/environment': ['Environmental equipment', 'Fire extinguisher'],
		'Real estate': ['Property development', 'Property management', 'Real estate sales'],
		'Services': ['Cleaning & maintenance', 'Dating agencies', 'Domestic worker agencies', 'Education companies', 'Catering & food services', 'Call centre', 'Auto repair & maintenance', 'Beauty schools', 'Employment agencies', 'Funeral', 'Security companies', 'Storage', 'Prison companies', 'Printing & copying', 'Hairdressing', 'Laundries & dry cleaners', 'Moving'],
		'Professional Services': ['Public relations', 'Architects', 'Auditing, consulting & accounting', 'Engineering', 'Law firms', 'Advertising & marketing'],
		'Military/weapons/security equipment': ['Arms/Weapons','Military/defence', 'Restraints'],
		'Natural Resources': ['Paper & cardboard', 'Petrol stations', 'Sand','Stone quarries', 'Oil, gas & coal', 'Mining', 'Cork', 'Diamond', 'Logging & lumber'],
		'Transport': ['Airports', 'Auto parts', 'Auto rental', 'Auto wrecking & salvage', 'Aircraft/Airline', 'Automobile & other motor vehicles', 'Bicycle', 'Tire', 'Transport: General', 'Taxi', 'Snowmobile', 'Bus', 'Ferry', 'Railroad'],
		'Technology': ['Internet & social media', 'Technology, telecom & electronics'],
		'Travel': ['Tourism', 'Hotel', 'Cruise ship'],
		'Shipping & handling': ['Express delivery', 'Forklift', 'Freight handling', 'Trucking', 'Shipping, ship-building & ship-scrapping', 'Packaging', 'Ports', 'Postal services'],
		'Sports': ['Sports teams & clubs', 'Sporting goods', 'Ski resorts', 'Fitness clubs & gyms', 'Golf courses', 'Race courses']
	},
	'issue': {
		'Overview': ['General business & human rights'],
		'Abuses': ['Abduction', 'Arbitrary detention', 'Beatings & violence','Complicity', 'Death penalty', 'Death threats', 'Deaths', 'Denial of freedom of expression', 'Denial of freedom of movement', '"Disappearances"', 'Displacement', 'Genocide', 'Human trafficking', 'Injuries', 'Intimidation & threats', 'Killings', 'Rape & sexual abuse', 'Sexual harassment', 'Slavery', 'Torture & ill-treatment', 'Unfair trial'],
		'Development & poverty': ['Poverty/Development/Economic & social rights: General', 'Linking development & human rights'],
		'Discrimination': ['Discrimination/diversity: General', 'Age discrimination', 'Disability discrimination', 'Gender discrimination', 'HIV/AIDS discrimination', 'Marital status discrimination', 'Political opinion discrimination', 'Pregnancy discrimination', 'Racial/ethnic/caste/origin discrimination', 'Religious discrimination', 'Sexual orientation & gender identity (LGBT) discrimination'],
		'Environment': ['Environment: General', 'Climate change', 'Environmental discrimination', 'Why environmental issues are human rights issues'],
		'Groups': ['Castes', 'Children (issues other than child labour)', 'Family', 'Fathers/Paternity', 'Homosexuals', 'Indigenous peoples', 'Men', 'Migrant & immigrant workers', 'Mothers/Maternity', 'Pregnant women', 'Racial & ethnic groups', 'Women'],
		'Health': ['Health: General (including workplace health & safety)', 'Access to medicines', 'Health as a human right', 'HIV/AIDS','Illness', 'Mental health'],
		'Investment, trade, globalisation': ['Export regulations/Export credit agencies', 'Globalisation', 'Divestment', 'Import regulations', 'Project financing/loans', 'Sanctions', 'Socially-responsible investing & shareholder activism', 'Trade'],
		'Labour': ['Freedom of association','Prison labour', 'Export processing zones', 'Forced labour & modern slavery', 'Labour: General', 'Living wage', 'Child labour'],
		'Security': ['Security issues & conflict zones: General', 'Conflict prevention & resolution'],
		'Universality': ['Universality of human rights: General', 'Islam', '"Asian values"'],
		'Other': ['Access to information', 'Access to water', 'Certification', 'Complaints mechanism', 'Consumers', 'Corruption', 'Cultural issues', 'Digital divide', 'Disclosure/use of payments to govts.', 'Education', 'Free, prior & informed consent', 'Genetically-modified food/crops', 'Housing', 'Impact assessment', 'Intellectual property', 'Land rights', 'Microcredit', 'Monitoring', 'Privacy', 'Privatisation', 'Procurement', 'Protests', 'Religion: General', 'Reputation', 'Right to food', 'Supply chain/"Fair trade"', 'Tax avoidance']
	}
}

stackedValues['issue']['Labour'][0] = 'Denial of freedom of association (see Labour: General)';

var superFilterLookUp = {}
for (var queryFilter in stackedValues) {
	var superGroup = stackedValues[queryFilter];
	superFilterLookUp[queryFilter] = {};
	for (var key in superGroup) {
		var topicList = superGroup[key];
		for (var j = 0; j < topicList.length; j++) {
			superFilterLookUp[queryFilter][topicList[j]] = key;
		}
	}
}





