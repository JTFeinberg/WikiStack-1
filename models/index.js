const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack', {
	logging: false
});

//page and user models
const Page = db.define('page', {
	title: {
		type: Sequelize.STRING,
		allowNull: false
	},
	urlTitle: {
		type: Sequelize.STRING,
		allowNull: false,
		get() {

            const route = this.getDataValue('urlTitle');
			return `/wiki/${route}`;
		}
	},
	content: {
		type: Sequelize.TEXT,
		allowNull: false
	},
	status: {
		type: Sequelize.ENUM('open', 'closed'),
		allowNull: false
	},
	date: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

const User = db.define('user', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			isEmail: true
		}
	}
});

Page.belongsTo(User, {
	as: 'author'
});


function generateUrlTitle (title) {
    if (title) {
      // Removes all non-alphanumeric characters from title
      // And make whitespace underscore
      return title.replace(/\s+/g, '_').replace(/\W/g, '');
    } else {
      // Generates random 5 letter string
      return Math.random().toString(36).substring(2, 7);
    }
  }
Page.beforeCreate(page => {
	page.urlTitle = generateUrlTitle(page.title);
});
module.exports = {
	db: db,
	Page: Page,
	User: User
};
