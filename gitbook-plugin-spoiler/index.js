module.exports = {

  website: {
    assets: "./assets",
    css: [
      "spoiler.css"
    ],
    js: [
      "spoiler.js"
    ]
  },

  blocks: {
    s: {
      process: function(blk) {
          return '<div class="spoiler" style="display: none;">' + blk.body + '</div>';
      }
    }
  }
};
