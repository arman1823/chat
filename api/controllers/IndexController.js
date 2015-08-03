/**
 * Created by arman on 8/3/15.
 */
module.exports = {

  index: function(req, res) {

    var req = this.req;
    if(req == 'arman'){
      res.send({ 'Car' : 'Ford' });
    }
    res.json({ status: false })
  }
};
